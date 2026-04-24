import PromptSync from "prompt-sync";

const prompt = PromptSync();

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {

    constructor(field) {
        this.field = field;
        this.currentX = 0;
        this.currentY = 0;
        this.finalX = 0;
        this.finalY = 0;
        this.fieldHeight = field.length;
        this.fieldWidth = field[0].length;
    }

    static generateField(height, width, trapPercent) {
        const maxItem = height * width;
        const trapQty = Math.floor(maxItem * trapPercent);
        console.log(`Map size: ${maxItem}`);
        console.log(`Hole count: ${trapQty}`);

        let arrField = [];

        for (let i = 0; i < maxItem; i++) {
            arrField.push(fieldCharacter);
        }

        for (let i = 0; i < trapQty; i++) {
            arrField[i] = hole;
        }

        arrField[trapQty] = pathCharacter;
        arrField[trapQty+1] = hat;
        
        //ใช้ arr method `.sort` ที่รับฟังก์ชันเปรียบเทียบระหว่างตัวแปรสองตัว จะสลับไปหน้าไปหลังขึ้นอยู่กับค่าติดลบหรือไม่ ซึ่งจะทำงานหลายรอบ แต่มีรอบจำกัด (๋JS จะวางแผนรอบไว้แล้ว) ทำให้ไม่วนลูปไปเรื่อย ๆ เมื่อเราใช้ `Math.random()` เข้าไป
        arrField.sort(() => {return Math.random()-0.5})
        
        let swapFrom = arrField.indexOf(pathCharacter);
        let swapTemp = arrField[0];

        if (swapTemp !== pathCharacter) {
            arrField[0] = arrField[swapFrom];
            arrField[swapFrom] = swapTemp;
        }
        
        const grid = [];

        for (let i = 0; (i / width) < height; i += width) {
        grid.push(arrField.slice(i, i + width));
        }

        return grid;
        
    }

    print() {
        const displayString = this.field.map(row => row.join('')).join('\n'); 
        console.log(displayString);
    }

    runGame() {
        let playing = true;

        // find hat
        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[y].length; x++) {
                if (this.field[y][x] === hat) {
                    this.finalX = x;
                    this.finalY = y;
                }
            }
        }
        
        // check if current position === hat position ?
        while (playing) {
            this.print();
            const direction = prompt("Which way do you want to go? (w/a/s/d): ");
            switch (direction.toLowerCase()) {
                case ('w'):
                    this.moveUp();
                    console.log(`last moved: ${direction}`);
                    break;
                case ('s'):
                    this.moveDown();
                    console.log(`last moved: ${direction}`);
                    break;
                case ('a'):
                    this.moveLeft();
                    console.log(`last moved: ${direction}`);
                    break;
                case ('d'):
                    this.moveRight();
                    console.log(`last moved: ${direction}`);
                    break;
                default:
                    console.log(`no movement!`);
                    break;
            }

            if (this.currentX < 0 || this.currentY < 0 || this.currentX >= this.fieldWidth || this.currentY >= this.fieldHeight) {
                console.log(`🚫 You went out of bounds! Game over.`);
                return playing = false;
            }

            if (this.field[this.currentY][this.currentX] === hole) {
                console.log(`💀 You fell into a hole! Game over.`);
                return playing = false;
            }

            if (this.field[this.currentY][this.currentX] === this.field[this.finalY][this.finalX]) {
                console.log("🎉 You found the hat! You win!");
                this.field[this.currentY][this.currentX] = "♥";
                this.print();
                return playing = false;
            }

            this.field[this.currentY][this.currentX] = pathCharacter;
        }
    }

    moveUp() {
        this.currentY -= 1;
    }

    moveDown() {
        this.currentY += 1;
    }
    
    moveLeft() {
        this.currentX -= 1;
    }

    moveRight() {
        this.currentX += 1;
    }

}

const myField = new Field(Field.generateField(50, 200, 0.15));
myField.runGame();