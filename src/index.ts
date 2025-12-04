let currentRadians = 0;
let currentSpeed = 0.5;
let stopRoulette = false;

addKeyInputBox();
const stopButton = document.getElementsByClassName('stop-button')[0] as HTMLButtonElement | null;
stopButton?.addEventListener('click', () => {
    stopRoulette = !stopRoulette;
    if (!stopRoulette) {
        currentSpeed = 0.5;
    }
    stopButton!.innerText = stopRoulette ? 'Restart' : 'Stop'
});
main();

function main() {
    const canvas = document.getElementsByClassName('main-canvas')[0] as HTMLCanvasElement | null;
    const context = canvas?.getContext('2d');

    if (context) {
        context.clearRect(0, 0, 800, 800);
        drawParts(context);
        applyInputBoxLabelColor();
        drawFrame(context);
        drawNeedle(context);
        applyTargetIndexInfo();
        currentRadians += currentSpeed;
        if (stopRoulette) slowDownRoulette();
    }
    requestAnimationFrame(main);
}

function drawNeedle(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(400, 200);
    context.lineTo(390, 40);
    context.lineTo(410, 40);
    context.lineTo(400, 200);
    context.closePath();
    context.fillStyle = 'grey';
    context.strokeStyle = 'black';
    context.fill();
    context.stroke();
}

function drawFrame(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(400, 400, 300, 0, 2 * Math.PI);
    context.closePath();
    context.strokeStyle = 'black';
    context.stroke();
}

function drawParts(context: CanvasRenderingContext2D) {
    const partCount = document.getElementsByClassName('input-box-row').length;
    for (let i = 0; i < partCount; i++) {
        context.fillStyle = getColor(i, partCount);
        drawPart(context, i, partCount);
    }
}

function drawPart(context: CanvasRenderingContext2D, index: number, total: number) {
    context.beginPath();
    context.moveTo(400, 400);
    context.arc(
        400,
        400,
        300,
        currentRadians + 2 * Math.PI * (-0.25 + (index - 0.5) / total),
        currentRadians + 2 * Math.PI * (-0.25 + (index + 0.5) / total)
    );
    context.lineTo(400, 400);
    context.closePath();
    context.fill();
}

function applyInputBoxLabelColor() {
    const inputBoxes = document.getElementsByClassName('input-box-label');
    for (let i = 0; i < inputBoxes.length; i++) {
        const inputBox = inputBoxes.item(i) as HTMLInputElement | null;
        if (!inputBox) continue;

        inputBox.style.backgroundColor = getColor(i, inputBoxes.length);
    }
}

function addKeyInputBox() {
    const container = document.getElementsByClassName('input-box-container')[0];
    container.getElementsByClassName('plus-button').item(0)?.remove();
    const rowCount = document.getElementsByClassName('input-box-row').length;
    const row = document.createElement('div');
    row.className = 'input-box-row';
    row.id = `input-box-row-${rowCount}`;
    container.appendChild(row);
    const label = document.createElement('div');
    label.className = 'input-box-label';
    label.id = `input-box-label-${rowCount}`;
    label.style.height = '32px';
    label.style.width = '32px';
    row.appendChild(label);
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.className = 'input-box';
    inputBox.id = `input-box-${rowCount}`;
    row.appendChild(inputBox);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = '×';
    deleteButton.onclick = () => row.remove();
    row.appendChild(deleteButton);
    const plusButton = document.createElement('button');
    plusButton.className = 'plus-button';
    plusButton.innerText = '+';
    plusButton.onclick = () => addKeyInputBox();
    container.appendChild(plusButton);
}

function applyTargetIndexInfo() {
    const index = targetIndex();
    const total = document.getElementsByClassName('input-box-row').length;
    const resultColorElement = document.getElementsByClassName('result-color')[0] as HTMLDivElement | undefined;
    const resultTextElement = document.getElementsByClassName('result-text')[0] as HTMLSpanElement | undefined;
    if (resultColorElement) {
        resultColorElement.style.backgroundColor = getColor(index, total);
    }
    if (resultTextElement) {
        resultTextElement.innerText = (document.getElementById(`input-box-${index}`) as HTMLInputElement | null)?.value.trim() ?? '';
    }
}

function slowDownRoulette() {
    if (currentSpeed > 0) {
        currentSpeed -= 0.005;
    }
    if (currentSpeed < 0) {
        currentSpeed = 0;
    }
}

function getColor(index: number, total: number) {
    return `hsl(${(index / total) * 360}, 100%, 50%)`;
}

function targetIndex() {
    const total = document.getElementsByClassName('input-box-row').length;
    const radians = (currentRadians - (0.5 / total) * 2 * Math.PI) % (2 * Math.PI);
    return total - 1 - Math.floor(total * radians / (2 * Math.PI));
}