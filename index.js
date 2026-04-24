import PromptSync from "prompt-sync";

const prompt = PromptSync();

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {

    constructor(field) {
        this.field = field;
    }

    static generateField(height, width, trapPercent) {
        const maxItem = height * width;
        const trapQty = Math.floor(maxItem * trapPercent);

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
        const displayString = this.field.map(row => {
            return row.join('');
        }).join('\n'); // 2. สุดท้ายเอาทุกแถวมาเชื่อมกันด้วยการขึ้นบรรทัดใหม่

        console.log(displayString);
    }
}

const myField = new Field(Field.generateField(3, 3, 0.2));
console.log(myField.field);
myField.print();
// myField.runGame();