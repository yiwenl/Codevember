export default class MathUtils {
  constructor(){
    console.log("setup a new class");
  }
  random(min, max) {
    return min + Math.random() * (max - min);
  }
}
