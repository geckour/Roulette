"use strict";
var _a;
let currentRadians = 0;
let currentSpeed = 0.5;
let stopRoulette = false;
addKeyInputBox();
(_a = document.getElementsByClassName('stop-button')[0]) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => stopRoulette = true);
main();
function main() {
    const canvas = document.getElementsByClassName('main-canvas')[0];
    const context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    if (context) {
        context.clearRect(0, 0, 400, 400);
        drawParts(context);
        applyInputBoxLabelColor();
        drawFrame(context);
        drawNeedle(context);
        applyTargetIndexInfo();
        currentRadians += currentSpeed;
        if (stopRoulette)
            slowDownRoulette();
    }
    requestAnimationFrame(main);
}
function drawNeedle(context) {
    context.beginPath();
    context.moveTo(200, 100);
    context.lineTo(195, 20);
    context.lineTo(205, 20);
    context.lineTo(200, 100);
    context.closePath();
    context.fillStyle = 'grey';
    context.strokeStyle = 'black';
    context.fill();
    context.stroke();
}
function drawFrame(context) {
    context.beginPath();
    context.arc(200, 200, 150, 0, 2 * Math.PI);
    context.closePath();
    context.strokeStyle = 'black';
    context.stroke();
}
function drawParts(context) {
    const partCount = document.getElementsByClassName('input-box-row').length;
    for (let i = 0; i < partCount; i++) {
        context.fillStyle = getColor(i, partCount);
        drawPart(context, i, partCount);
    }
}
function drawPart(context, index, total) {
    context.beginPath();
    context.moveTo(200, 200);
    context.arc(200, 200, 150, currentRadians + 2 * Math.PI * (-0.25 + (index - 0.5) / total), currentRadians + 2 * Math.PI * (-0.25 + (index + 0.5) / total));
    context.lineTo(200, 200);
    context.closePath();
    context.fill();
}
function applyInputBoxLabelColor() {
    const inputBoxes = document.getElementsByClassName('input-box-label');
    for (let i = 0; i < inputBoxes.length; i++) {
        const inputBox = inputBoxes.item(i);
        if (!inputBox)
            continue;
        inputBox.style.backgroundColor = getColor(i, inputBoxes.length);
    }
}
function addKeyInputBox() {
    var _a;
    const container = document.getElementsByClassName('input-box-container')[0];
    (_a = container.getElementsByClassName('plus-button').item(0)) === null || _a === void 0 ? void 0 : _a.remove();
    const rowCount = document.getElementsByClassName('input-box-row').length;
    const row = document.createElement('div');
    row.className = 'input-box-row';
    row.id = `input-box-row-${rowCount}`;
    container.appendChild(row);
    const label = document.createElement('div');
    label.className = 'input-box-label';
    label.id = `input-box-label-${rowCount}`;
    label.style.height = '20px';
    label.style.width = '20px';
    row.appendChild(label);
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.className = 'input-box';
    inputBox.id = `input-box-${rowCount}`;
    row.appendChild(inputBox);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'x';
    deleteButton.onclick = () => row.remove();
    row.appendChild(deleteButton);
    const plusButton = document.createElement('button');
    plusButton.className = 'plus-button';
    plusButton.innerText = '+';
    plusButton.onclick = () => addKeyInputBox();
    container.appendChild(plusButton);
}
function applyTargetIndexInfo() {
    var _a, _b;
    const index = targetIndex();
    const total = document.getElementsByClassName('input-box-row').length;
    const resultColorElement = document.getElementsByClassName('result-color')[0];
    const resultTextElement = document.getElementsByClassName('result-text')[0];
    if (resultColorElement) {
        resultColorElement.style.backgroundColor = getColor(index, total);
    }
    if (resultTextElement) {
        resultTextElement.innerText = (_b = (_a = document.getElementById(`input-box-${index}`)) === null || _a === void 0 ? void 0 : _a.value.trim()) !== null && _b !== void 0 ? _b : '';
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
function getColor(index, total) {
    return `hsl(${(index / total) * 360}, 100%, 50%)`;
}
function targetIndex() {
    const total = document.getElementsByClassName('input-box-row').length;
    const radians = (currentRadians - (0.25 + 0.5 / total) * Math.PI) % (2 * Math.PI);
    return total - 1 - Math.floor((radians / (2 * Math.PI)) * total);
}
