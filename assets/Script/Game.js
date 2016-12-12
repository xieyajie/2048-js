cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        tiles: [],
        manager: {
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        this.manager = require("Manager");
        if (this.manager.cardinality == 2) {
            this.tiles = [
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ];
        } else if (this.manager.cardinality == 3) {
            this.tiles = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
        }

    },

    moveUp: function () {
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        var isMoved = false;
        for (var col = 0; col < cols; col++) {
            for (var row = (rows - 1); row >= 0; row--) {
                if (tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 < (rows - 1); row1++) {
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
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        var isMoved = false;
        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
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
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        var isMoved = false;
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
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
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        var isMoved = false;
        for (var row = 0; row < rows; row++) {
            for (var col = (cols - 1); col >= 0; col--) {
                if (tiles[row][col] != null) {
                    for (var col1 = col; col1 < (cols - 1); col1++) {
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
