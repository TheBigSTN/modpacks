// priority: 0

const pendingRequests = [];
const REQUEST_TIMEOUT = 60 * 1000;

ServerEvents.commandRegistry((event) => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal("tpa")
      .then(
        Commands.literal("request").then(
          Commands.argument("target", Arguments.PLAYER.create(event)).executes(
            (c) =>
              requestTPA(
                c.source.player,
                Arguments.PLAYER.getResult(c, "target")
              )
          )
        )
      )
      .then(
        Commands.literal("accept").then(
          Commands.argument("target", Arguments.PLAYER.create(event)).executes(
            (c) =>
              acceptTPA(
                c.source.player,
                Arguments.PLAYER.getResult(c, "target")
              )
          )
        )
      )
      .then(
        Commands.literal("reject").then(
          Commands.argument("target", Arguments.PLAYER.create(event)).executes(
            (c) =>
              denyTPA(c.source.player, Arguments.PLAYER.getResult(c, "target"))
          )
        )
      )
      .then(
        Commands.literal("list").executes((c) =>
          listPendingRequests(c.source.player)
        )
      )
  );
});

// Send teleport request
let requestTPA = (player, target) => {
  const timeout = setTimeout(() => {
    let index = pendingRequests.findIndex(
      (request) =>
        request.to === target.username && request.from === player.username
    );
    if (index !== -1) {
      pendingRequests.splice(index, 1);
      player.tell(
        Text.red(`Your teleport request to ${target.username} has expired.`)
      );
    }
  }, REQUEST_TIMEOUT);

  if (
    !pendingRequests.some(
      (request) =>
        request.to === target.username && request.from === player.username
    )
  ) {
    pendingRequests.push({
      to: target.username,
      from: player.username,
      timeout: timeout,
    });
  } else {
    const index = pendingRequests.findIndex(
      (request) =>
        request.to === target.username && request.from === player.username
    );
    clearTimeout(pendingRequests[index].timeout);
    pendingRequests[index].timeout = timeout;
  }

  target.tell(
    Text.gold(`${player.username} wants to teleport to you!\n`)
      .append(Text.gold("Do you want to "))
      .append(
        Text.green("[accept]").clickRunCommand("/tpa accept " + player.username)
      )
      .append(
        Text.gold(" or ").append(
          Text.red("[reject]").clickRunCommand("/tpa reject " + player.username)
        )
      )
  );

  player.tell(Text.gold(`Request sent to ${target.username}.`));
  return 1;
};

// Accept teleport request
let acceptTPA = (player, target) => {
  if (
    !pendingRequests.some(
      (request) =>
        request.to === player.username && request.from === target.username
    )
  ) {
    player.tell(Text.red("No teleport request from that player!"));
    return 0;
  }

  // Notify both players that the teleport request was accepted
  target.displayClientMessage(
    Text.green(
      `Teleport request accepted! Teleporting to ${player.username} in 5 seconds...`
    ),
    true
  );
  player.displayClientMessage(
    Text.green(`${target.username} is being teleported to you in 5 seconds...`),
    true
  );

  let countdown = 5; // Set the countdown timer

  // Countdown logic with interval
  let interval = setInterval(() => {
    if (countdown > 0) {
      target.displayClientMessage(
        Text.yellow(
          `Teleporting to ${player.username} in ${countdown} seconds...`
        ),
        true
      );
      player.displayClientMessage(
        Text.yellow(
          `${target.username} will arrive in ${countdown} seconds...`
        ),
        true
      );
    } else {
      // Perform the teleport when the countdown reaches 0
      target.setPosition(player.x, player.y, player.z);
      target.displayClientMessage(
        Text.green("You have been teleported!"),
        true
      );
      player.displayClientMessage(
        Text.green(`${target.username} has been teleported to you!`),
        true
      );

      // Remove the request from the pending list
      pendingRequests.splice(
        pendingRequests.findIndex(
          (request) =>
            request.to === target.username && request.from === player.username
        ),
        1
      );

      clearInterval(interval);
    }
    countdown--;
  }, 1000);

  return 1;
};

let denyTPA = (player, target) => {
  if (
    !pendingRequests.some(
      (request) =>
        request.to === player.username && request.from === target.username
    )
  ) {
    player.tell(Text.red("No teleport request from that player!"));
    return 0;
  }

  target.tell(Text.red(`${player.username} has denied your teleport request!`));

  // Remove the denied request from pendingRequests
  pendingRequests.splice(
    pendingRequests.findIndex(
      (request) =>
        request.to === target.username && request.from === player.username
    ),
    1
  );

  player.tell(
    Text.green(`You denied the teleport request from ${target.username}.`)
  );

  return 1;
};

// Show pending requests with clickable accept/deny buttons
let listPendingRequests = (player) => {
  // Filter for requests where the target is the current player
  let requests = pendingRequests.filter(
    (request) => request.to === player.username
  );

  if (!requests || requests.length === 0) {
    player.tell(Text.red("No pending teleport requests!"));
    return 0;
  }

  player.tell(Text.gold("\nPending TPA requests:"));

  // Iterate through the matching requests and show them with clickable buttons
  requests.forEach((request) => {
    let requesterName = request.from;

    let acceptButton = Text.green("[Accept]").clickRunCommand(
      `/tpa accept ${requesterName}`
    );

    let denyButton = Text.red("[Deny]").clickRunCommand(
      `/tpa deny ${requesterName}`
    );

    player.tell(
      Text.gold(`${requesterName}: `)
        .append(acceptButton)
        .append(Text.gold(" "))
        .append(denyButton)
    );
  });

  return 1;
};
