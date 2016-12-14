cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        mapBackground: cc.Sprite,
        labelBackground: cc.Prefab,

        manager: {
            default: null
        },
        tiles: [],
        tile: cc.Prefab,

        tileOriginX: 0,
        tileOriginY: 0,
        tileSpace: 10,

        score: 0,
        scoreLabel: cc.Label,
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

        this.setupMapBackground();
        this.setupEventListener();
    },

    setTilePosition: function (tile, toRow, toCol) {
        let x = this.tileOriginX + this.tileSpace + toCol * (this.tileSpace + this.manager.tileSize.width);
        let y = this.tileOriginY + this.tileSpace + toRow * (this.tileSpace + this.manager.tileSize.height);
        tile.setPosition(x, y);
        tile.row = toRow;
        tile.col = toCol;
    },

    /**
     * 初始化游戏背景, 左下角是起点
     */
    setupMapBackground: function () {
        this.background.node.color = this.manager.backgroundColor();
        this.mapBackground.node.color = this.manager.scoreBoardColor();

        let labelInstance = cc.instantiate(this.labelBackground);
        this.manager.tileSize.width = labelInstance.width;
        this.manager.tileSize.height = labelInstance.height;

        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        let mapWidth = (this.manager.tileSize.width + this.tileSpace) * rows + this.tileSpace;
        let mapHeight = (this.manager.tileSize.height + this.tileSpace) * cols + this.tileSpace;
        this.mapBackground.node.width = mapWidth;
        this.mapBackground.node.height = mapHeight;
        this.tileOriginX = -1 * (mapWidth - this.manager.tileSize.width) / 2;
        this.tileOriginY = -1 * (mapHeight - this.manager.tileSize.height) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let label = cc.instantiate(this.labelBackground);
                this.setTilePosition(label, i, j);
                this.mapBackground.node.addChild(label);
            }
        }

        this.createRandomTile();
        this.createRandomTile();
    },

    /**
     * 初始化系统事件监听
     */
    setupEventListener: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    /**
     * 键盘按钮抬起时的事件响应
     * @param event
     */
    onKeyUp: function (event) {
        var isMoved = false;
        switch (event.keyCode) {
            case cc.KEY.up: {
                isMoved = this.moveUp();
                break;
            }
            case cc.KEY.down: {
                isMoved = this.moveDown();
                break;
            }
            case cc.KEY.left: {
                isMoved = this.moveLeft();
                break;
            }
            case cc.KEY.right: {
                isMoved = this.moveRight();
                break;
            }
        }

        if (isMoved) {
            this.createRandomTile();
        }
    },

    /**
     * 增加分数
     */
    addScore: function (add) {
        this.score += add;

        this.scoreLabel.string = this.score.toString();
    },

    /**
     * 清空分数
     */
    clearScore: function () {
        this.score = 0;

        this.scoreLabel.string = this.score.toString();
    },

    createRandomTile: function () {
        var isCreated = true;

        var count = 0;
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();
        let totalCount = rows * cols;
        var row;
        var col;
        while (true) {
            count++;
            row = Math.floor(Math.random() * rows);
            col = Math.floor(Math.random() * cols);
            if (this.tiles[row][col] == null) {
                var tile = cc.instantiate(this.tile);
                this.tiles[row][col] = tile;
                this.setTilePosition(tile, row, col);
                this.mapBackground.node.addChild(tile);
                break;
            }
            if (count >= totalCount) {// 格子满了
                isCreated = false;
                break;
            }
        }

        return isCreated;
    },

    mergeTiles: function (tile, toTile) {
        
    },

    moveTilePosition: function (tile, fromRow, fromCol, toRow, toCol) {
        this.tiles[toRow][toCol] = tile;
        this.tiles[fromRow][fromCol] = null;
        this.setTilePosition(tile, toRow, toCol);
    },

    moveUp: function () {
        // return this.moveTile(function (i, j) {
        //     return [3-i, j];
        // }, function (row, col) {
        //     return [(row + 1 >= 4) ? -1 : (row + 1), col];
        // });

        let rowsCount = this.manager.getRowCount();
        let colsCount = this.manager.getColCount();
        return this.moveVertically(colsCount, rowsCount,
            function (fromRow) {
                return (rowsCount - 1 - fromRow);
            }
        );
    },

    moveDown: function () {
        // return this.moveTile(function (i, j) {
        //     return [i, j];
        // }, function (row, col) {
        //     return [(row -1 < 0) ? -1 : (row - 1), col];
        // });

        let rowsCount = this.manager.getRowCount();
        let colsCount = this.manager.getColCount();
        return this.moveVertically(colsCount, rowsCount,
            function (fromRow) {
                return fromRow;
            }
        );
    },

    moveLeft: function () {
        // return this.moveTile(function (i, j) {
        //     return [j, i];
        // }, function (row, col) {
        //     return [row, (col - 1 < 0) ? -1 : (col - 1)];
        // });

        let rowsCount = this.manager.getRowCount();
        let colsCount = this.manager.getColCount();
        return this.moveHorizontally(rowsCount, colsCount,
            function (fromCol) {
                return fromCol;
            }
        );
    },

    moveRight: function () {
        // return this.moveTile(function (i, j) {
        //     return [j, 3-i];
        // }, function (row, col) {
        //     return [row, (col + 1 >= 4) ? -1 : (col + 1)];
        // });

        let rowsCount = this.manager.getRowCount();
        let colsCount = this.manager.getColCount();
        return this.moveHorizontally(rowsCount, colsCount,
            function (fromCol) {
                return (colsCount - 1 - fromCol);
            }
        );
    },

    //竖向
    moveVertically: function (outerCount, innerCount, getRealRow) {
        let isMoved = false;

        for (var col = 0; col < outerCount; col++) {
            //比较节点
            var tagRow = 0;
            var tagTile = this.tiles[getRealRow(tagRow)][col];

            for (var row = 1; row < innerCount; row++) {
                let realRow = getRealRow(row);
                var tile = this.tiles[realRow][col];
                if (tile == null) {
                    continue;
                }

                if (tagTile == null) {
                    this.moveTilePosition(tile, realRow, col, getRealRow(tagRow), col);
                    tagTile = tile;
                    isMoved = true;
                    continue;
                }

                let tagNode = tagTile.getComponent('Tile');
                let curNode = tile.getComponent('Tile');
                let tmpRow = getRealRow(tagRow + 1);

                if (tagNode.tag != curNode.tag) {
                    if (realRow != tmpRow) {
                        this.moveTilePosition(tile, realRow, col, tmpRow, col);
                        tagRow++;
                        isMoved = true;
                    } else {
                        tagRow = row;
                    }
                    tagTile = tile;
                } else {
                    // 合并
                    tagNode.tag += 1;
                    tagNode.updateTag();

                    // 删除没有用的节点
                    tile.removeFromParent();
                    this.tiles[realRow][col] = null;

                    //更新比较节点
                    tagRow++;
                    tagTile = this.tiles[getRealRow(tagRow)][col];

                    isMoved = true;
                }

            }
        }

        return isMoved;
    },

    //横向
    moveHorizontally: function (outerCount, innerCount, getRealCol) {
        let isMoved = false;

        for (var row = 0; row < outerCount; row++) {
            //比较节点
            var tagCol = 0;
            var tagTile = this.tiles[row][getRealCol(tagCol)];

            for (var col = 1; col < innerCount; col++) {
                let realCol = getRealCol(col);
                var tile = this.tiles[row][realCol];
                if (tile == null) {
                    continue;
                }

                if (tagTile == null) {
                    this.moveTilePosition(tile, row, realCol, row, getRealCol(tagCol));
                    tagTile = tile;
                    isMoved = true;
                    continue;
                }

                let tagNode = tagTile.getComponent('Tile');
                let curNode = tile.getComponent('Tile');
                let tmpCol = getRealCol(tagCol + 1);

                if (tagNode.tag != curNode.tag) {
                    if (realCol != tmpCol) {
                        this.moveTilePosition(tile, row, realCol, row, tmpCol);
                        tagCol++;
                        isMoved = true;
                    } else {
                        tagCol = col;
                    }
                    tagTile = tile;
                } else {
                    // 合并
                    tagNode.tag += 1;
                    tagNode.updateTag();

                    // 删除没有用的节点
                    tile.removeFromParent();
                    this.tiles[row][realCol] = null;

                    //更新比较节点
                    tagCol++;
                    tagTile = this.tiles[row][getRealCol(tagCol)];
                    isMoved = true;
                }

            }
        }

        return isMoved;
    },

    // moveTile: function (getRowColIndex, getNextRowColIndex) {
    //     let isMoved = false;
    //     let rowsCount = this.manager.getRowCount();
    //     let colsCount = this.manager.getColCount();
    //
    //     for (let i = 0; i < rowsCount; i++) {
    //         for (let j = 0; j < colsCount; j++) {
    //             let [row, col] = getRowColIndex(i, j);
    //             // 这个位置上有东西
    //             let tile = this.tiles[row][col];
    //             if (tile != null) {
    //
    //                 // 接下来向一个方向一直移动 tile
    //                 let lastRow = row;
    //                 let lastCol = col;
    //                 let [nextRow, nextCol] = getNextRowColIndex(lastRow, lastCol);
    //                 // 注意越界条件
    //                 while (nextRow != -1 && nextCol != -1) {
    //                     let nextTile = this.tiles[nextRow][nextCol];
    //                     // 前方没有东西
    //                     if (nextTile == null) {
    //                         this.moveTilePosition(tile, lastRow, lastCol, nextRow, nextCol);
    //                         isMoved = true;
    //
    //                         // 准备下次循环
    //                         lastRow = nextRow;
    //                         lastCol = nextCol;
    //                         [nextRow, nextCol] = getNextRowColIndex(lastRow, lastCol);
    //                     }
    //                     // 前方有东西
    //                     else {
    //                         let curNode = tile.getComponent('Tile');
    //                         let nextNode = nextTile.getComponent('Tile');
    //                         // 他们点数一样，应该合并，然后结束移动
    //                         if (nextNode.tag == curNode.tag) {
    //                             // 合并
    //                             nextNode.tag += 1;
    //                             nextNode.updateTag();
    //
    //                             // 删除没有用的节点
    //                             tile.removeFromParent();
    //                             this.tiles[lastRow][lastCol] = null;
    //
    //                             break;
    //                         }
    //                         // 点数不同，移动结束
    //                         else {
    //                             break;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //     return isMoved;
    // },
});
