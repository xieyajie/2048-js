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

    moveUp: function () {
        return this.moveTile(function (i, j) {
            return [3-i, j];
        }, function (row, col) {
            return [(row + 1 >= 4) ? -1 : (row + 1), col];
        });
    },

    moveDown: function () {
        return this.moveTile(function (i, j) {
            return [i, j];
        }, function (row, col) {
            return [(row -1 < 0) ? -1 : (row - 1), col];
        });
    },

    moveLeft: function () {
        return this.moveTile(function (i, j) {
            return [j, i];
        }, function (row, col) {
            return [row, (col - 1 < 0) ? -1 : (col - 1)];
        });
    },

    moveRight: function () {
        return this.moveTile(function (i, j) {
            return [j, 3-i];
        }, function (row, col) {
            return [row, (col + 1 >= 4) ? -1 : (col + 1)];
        });
    },

    moveTile: function (getRowColIndex, getNextRowColIndex) {
        let isMoved = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let [row, col] = getRowColIndex(i, j);
                // 这个位置上有东西
                let tile = this.tiles[row][col];
                if (tile != null) {

                    // 接下来向一个方向一直移动 tile
                    let lastRow = row;
                    let lastCol = col;
                    let [nextRow, nextCol] = getNextRowColIndex(lastRow, lastCol);
                    // 注意越界条件
                    while (nextRow != -1 && nextCol != -1) {
                        let nextTile = this.tiles[nextRow][nextCol];
                        // 前方没有东西
                        if (nextTile == null) {
                            this.tiles[nextRow][nextCol] = tile;
                            this.tiles[lastRow][lastCol] = null;
                            this.setTilePosition(tile, nextRow, nextCol);
                            isMoved = true;

                            // 准备下次循环
                            lastRow = nextRow;
                            lastCol = nextCol;
                            [nextRow, nextCol] = getNextRowColIndex(lastRow, lastCol);
                        }
                        // 前方有东西
                        else {
                            let curNode = tile.getComponent('Tile');
                            let nextNode = nextTile.getComponent('Tile');
                            // 他们点数一样，应该合并，然后结束移动
                            if (nextNode.tag == curNode.tag) {
                                // 更新分数
                                let Manager = require("Manager");
                                let add = Math.pow(Manager.cardinality, curNode.tag+1);
                                this.addScore(add);

                                // 合并
                                nextNode.tag += 1;
                                nextNode.updateTag();

                                // 删除没有用的节点
                                tile.removeFromParent();
                                this.tiles[lastRow][lastCol] = null;

                                break;
                            }
                            // 点数不同，移动结束
                            else {
                                break;
                            }
                        }
                    }
                }
            }
        }

        return isMoved;
    },
});
