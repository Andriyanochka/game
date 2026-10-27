export default class Ship {
  #id;
  #x;
  #y;
  #size;
  #color;

  constructor(x, y, size, color) {
    this.#id = document.createElement("div"); 
    this.#x = x;
    this.#y = y;
    this.#size = size;
    this.#color = color;
  }

  id() {
    return this.#id;
  }

  show() {
    this.#id.style = `position: absolute; left: ${this.#x}px; top: ${this.#y}px; width: ${this.#size}px; height: ${this.#size}px; display: block; background-color: ${this.#color}; border: 1px solid #000;`;
  }

  hide() {
    this.#id.style.display = "none";
  }

  move(dx, dy) {
    this.hide();
    this.#x += dx;
    this.#y += dy;
    this.show();
  }

  destroy() {
    this.#id.remove();
  }

  x() {
    return this.#x;
  }

  y() {
    return this.#y;
  }
}
