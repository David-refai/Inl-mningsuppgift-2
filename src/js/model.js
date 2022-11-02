
import Enemy from "./components/enemy.js";
import { playerOne, playerTwo, canvas} from "./config.js";
import Projectile from "./components/projectile.js";


export const state = {

players: [playerOne, playerTwo],
enemies: [],
projectiles: [],
}

export const playerVelocity = function () {
  state.players[0].position.y += state.players[0].velocity.y;
  state.players[1].position.y += state.players[1].velocity.y;
};

export const createAndPushEnemy = function () {
    //? function to create enemy
    if (Math.random() < 0.02) {
      //? 1. Create enemy as coming from the left side of the canvas
      const enemyLeftSide = new Enemy(
        { x: canvas.width + 100, y: Math.random() * canvas.height - 150 },
        { x: -1, y: 0 }
      );
      state.enemies.push(enemyLeftSide);
  
      //? 2. Create enemy as coming from the right side of the canvas
      const enemyRightSide = new Enemy(
        { x: 0, y: Math.random() * canvas.height - 150 },
        { x: 1, y: 0 }
      );
      state.enemies.push(enemyRightSide);
    }
  };
  
  
  
  //* function to draw the projectiles
  export const loopProjectiles = function (player) {
    //? 2. Draw the projectiles
    for (let j = 0; j < state.projectiles.length; j++) {
      let projectile = state.projectiles[j];
      projectile.update();
  
      //? 3. Check for collision between projectiles and enemies
      if (player.colliedWithProjectile(projectile)) {
        player.position.y = -player.height - 10;
  
        state.projectiles.splice(j, 1);
        player.decreaseScore();
        if( player === playerOne){ 
          playerTwo.increaseScore(); 
        }
      }
    }
  };
  
  //* function to draw the enemies
  export const loopEnemies = function (player) {
    //? 1. Create enemies
    createAndPushEnemy();
  
    //? 2. Draw the enemies
    for (let i = 0; i < state.enemies.length; i++) {
      state.enemies[i].update();
  
      if (player.colliedWithEnemy(state.enemies[i])) {
        player.position.y = -player.height - 10;
        player.decreaseScore();
      }
    }
  };


  export const createProjectiles = function (player, velocity) {
    state.projectiles.push(new Projectile({
      position: {
        x: player.position.x + player.width / 2,
        y: player.position.y,
      },
      velocity: velocity,
    }));
  };
  
  //? 4. Check for collision between projectiles and enemies
  
  export const init = function () {
    //? 1. Draw the player
    state.players.forEach((player) => {
      player.update();
  
      //? 2. Draw the projectiles
      loopProjectiles(player);
  
      //? 4. Check for collision between enemies and player
      loopEnemies(player);
  
      //? 5. Check for collision between canvas and player, if true, return the player to the bottom of the canvas
      // if (player.position.y < -player.height) {
      //   player.position.y = canvas.height - 10;
      //   //! score
        
      // }

      if (player.colliedWithTopCanvas()) {
        player.position.y = canvas.height - 10;
        player.increaseScore();
      }
      //? 6. method for not letting the player go out of the canvas
      if (player.colliedWithBottomCanvas()) {
        return true;
      }
    });
  };


