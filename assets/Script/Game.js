cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        tiles: [],
        mapBackground: cc.Sprite,
        labelBackground: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        var Manager = require("Manager");
        if (Manager.cardinality == 2) {
            this.tiles = [
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ];
        } else if (Manager.cardinality == 3) {
            this.tiles = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
        }

        this.setupMapBackground();
    },

    /**
     * 设置游戏背景
     */
    setupMapBackground: function () {
        let bgSize = this.mapBackground.node.width;
        let labelInstance = cc.instantiate(this.labelBackground);
        let labelSize = labelInstance.width;

        let spaceSize = (bgSize - (4 * labelSize)) / 5;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let origin = -(bgSize / 2) + (labelSize / 2);
                let x = origin + spaceSize + i * (spaceSize + labelSize);
                let y = origin + spaceSize + j * (spaceSize + labelSize);

                let label = cc.instantiate(this.labelBackground);
                label.setPosition(x, y);
                this.mapBackground.node.addChild(label);
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },

    moveUp: function () {
        var isMoved = false;
        for (var col = 0; col < 4; col++) {
            for (var row = 3; row >= 0; row--) {
                if (tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 < 3; row1++) {
                        if (tiles[row1 + 1][col] == null)//如果没有向上移动
                        {
                            tiles[row1 + 1][col] = tiles[row1][col];
                            tiles[row1][col] = null;
                            tiles[row1 + 1][col].moveTo(row1 + 1, col);
                            isMoved = true;
                        } else if (tiles[row1 + 1][col].num == tiles[row1][col].num) {// 合并
                            tiles[row1 + 1][col].num = parseInt(tiles[row1][col].num) * 2;
                            tiles[row1 + 1][col].updateNum();
                            tiles[row1][col].removeFromParent();
                            tiles[row1][col] = null;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        return isMoved;
    },

    moveDown: function () {
        var isMoved = false;
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 > 0; row1--) {
                        if (tiles[row1 - 1][col] == null)//如果没有向下移动
                        {
                            tiles[row1 - 1][col] = tiles[row1][col];
                            tiles[row1][col] = null;
                            tiles[row1 - 1][col].moveTo(row1 - 1, col);
                            isMoved = true;
                        } else if (tiles[row1 - 1][col].num == tiles[row1][col].num) {// 合并
                            tiles[row1 - 1][col].num = parseInt(tiles[row1][col].num) * 2;
                            tiles[row1 - 1][col].updateNum();
                            tiles[row1][col].removeFromParent();
                            tiles[row1][col] = null;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        return isMoved;
    },

    moveLeft: function () {
        var isMoved = false;
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (tiles[row][col] != null) {
                    for (var col1 = col; col1 > 0; col1--) {
                        if (tiles[row][col1 - 1] == null) {
                            tiles[row][col1 - 1] = tiles[row][col1];
                            tiles[row][col1] = null;
                            tiles[row][col1 - 1].moveTo(row, col1 - 1);
                            isMoved = true;
                        } else if (tiles[row][col1 - 1].num == tiles[row][col1].num) {// 合并
                            tiles[row][col1 - 1].num = parseInt(tiles[row][col1].num) * 2;
                            tiles[row][col1 - 1].updateNum();
                            tiles[row][col1].removeFromParent();
                            tiles[row][col1] = null;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        return isMoved;
    },

    moveRight: function () {
        var isMoved = false;
        for (var row = 0; row < 4; row++) {
            for (var col = 3; col >= 0; col--) {
                if (tiles[row][col] != null) {
                    for (var col1 = col; col1 < 3; col1++) {
                        if (tiles[row][col1 + 1] == null) {
                            tiles[row][col1 + 1] = tiles[row][col1];
                            tiles[row][col1] = null;
                            tiles[row][col1 + 1].moveTo(row, col1 + 1);
                            isMoved = true;
                        } else if (tiles[row][col1 + 1].num == tiles[row][col1].num) {// 合并
                            tiles[row][col1 + 1].num = parseInt(tiles[row][col1].num) * 2;
                            tiles[row][col1 + 1].updateNum();
                            tiles[row][col1].removeFromParent();
                            tiles[row][col1] = null;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        return isMoved;
    },

});
