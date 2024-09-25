import { Object3D } from 'three';

import ModelLoader from '../../src/ModelLoader';
import { groundLevel } from '../GameSettings';

export const Fill = {
  empty: 'empty',
  solid: 'solid',
  random: 'random',
};

const HAS_WALLS = true;
const HAS_OBSTACLES = true;
const HAS_VARIETY = true;

export default class Grass extends Object3D {
  active = false;
  entities = [];

  top = 0.4;
  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center
*/

  generate = (type = Fill.random) => {
    this.entities.map(val => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.treeGen(type);
  };

  obstacleMap = {};
  addObstacle = x => {
    let mesh;

    
    if (HAS_VARIETY || true) 
      {
      // mesh = ModelLoader._tree.getRandom();
      if (this.randVal % 2) {
        mesh = ModelLoader._boulder.getRandom_ByMap(this.randVal);
      } else {
        mesh = ModelLoader._tree.getRandom_ByMap(this.randVal);
      }
      // Math.random() < 0.4
      //   ? ModelLoader._boulder.getRandom()
      //   : ModelLoader._tree.getRandom();
    } else {
      mesh = ModelLoader._tree.getRandom_ByMap(this.randVal);
    }


    this.obstacleMap[`${x | 0}`] = { index: this.entities.length };
    this.entities.push({ mesh });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  treeGen = type => {

    // 0 - 8
    let _rowCount = 0;
    // const count = Math.round(Math.random() * 2) + 1;
    const count = 2;
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;
      if (type === Fill.solid) {
        this.addObstacle(_x);
        continue;
      }

      if (HAS_WALLS) {
        /// Walls
        if (x >= 9 || x <= -1) {
          this.addObstacle(_x);
          continue;
        }
      }

      if (HAS_OBSTACLES | true) {
        if (_rowCount < count )
           {
          // if (_x !== 0 && Math.random() > 0.6) {
          if (_x !== 0 && this.randVal / 100 > 0.5) {
            this.addObstacle(_x);
            _rowCount++;
          }
        }
      }

    }
  };

  constructor(heroWidth, onCollide,randVal) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;
    this.randVal = randVal;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
