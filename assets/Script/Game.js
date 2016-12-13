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
            // this.createRandomTile();
        }
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
        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        var isMoved = false;
        for (var col = 0; col < cols; col++) {
            for (var row = (rows - 1); row >= 0; row--) {
                if (this.tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 < (rows - 1); row1++) {
                        if (this.tiles[row1 + 1][col] == null)//如果没有向上移动
                        {
                            this.tiles[row1 + 1][col] = this.tiles[row1][col];
                            this.tiles[row1][col] = null;
                            this.setTilePosition(this.tiles[row1 + 1][col], row1 + 1, col);
                            isMoved = true;
                        } else if (this.tiles[row1 + 1][col].level == this.tiles[row1][col].level) {// 合并
                            this.tiles[row1 + 1][col].level += 1;
                            this.tiles[row1 + 1][col].updateLevel();
                            this.tiles[row1][col].removeFromParent();
                            this.tiles[row1][col] = null;
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


        // for (var col = 0; col < cols; col++) {
        //     var tagRow = rows - 1;
        //     var tagTile = this.tiles[tagRow][col];
        //     for (var row = (rows - 2); row >= 0; row--) {
        //         var tile = this.tiles[row][col];
        //         if (tile == null) {
        //             continue;
        //         } else if (tagTile == null) {
        //             this.setTilePosition(tile, tagRow, col);
        //             this.tiles[tagRow][col] = tile;
        //             this.tiles[row][col] = null;
        //             isMoved = true;
        //             continue;
        //         }
        //     //
        //     //     if (tile.level == tagTile.level) { //合并到tagTile，tagTile上移一格
        //     //         tagTile.level += 1;
        //     //         tagTile.updateLevel();
        //     //         tile.removeFromParent();
        //     //         this.tiles[row][col] = null;
        //     //
        //     //         tagRow += 1;
        //     //         tagTile = this.tiles[tagRow][col];
        //     //         isMoved = true;
        //     //     } else {
        //     //         tagRow = row;
        //     //         tagTile = this.tiles[tagRow][col];
        //     //     }
        //     }
        // }
        //
        // return isMoved;

        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                if (this.tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 > 0; row1--) {
                        if (this.tiles[row1 - 1][col] == null)//如果没有向下移动
                        {
                            this.tiles[row1 - 1][col] = this.tiles[row1][col];
                            this.tiles[row1][col] = null;
                            this.setTilePosition(this.tiles[row1 - 1][col], row1 - 1, col);
                            isMoved = true;
                        } else if (this.tiles[row1 - 1][col].level == this.tiles[row1][col].level) {// 合并
                            this.tiles[row1 - 1][col].level += 1;
                            this.tiles[row1 - 1][col].updateLevel();
                            this.tiles[row1][col].removeFromParent();
                            this.tiles[row1][col] = null;
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
                if (this.tiles[row][col] != null) {
                    for (var col1 = col; col1 > 0; col1--) {
                        if (this.tiles[row][col1 - 1] == null) {
                            this.tiles[row][col1 - 1] = this.tiles[row][col1];
                            this.tiles[row][col1] = null;
                            this.setTilePosition(this.tiles[row][col1 - 1], row, col1 - 1);
                            isMoved = true;
                        } else if (this.tiles[row][col1 - 1].level == this.tiles[row][col1].level) {// 合并
                            this.tiles[row][col1 - 1].level += 1;
                            this.tiles[row][col1 - 1].updateLevel();
                            this.tiles[row][col1].removeFromParent();
                            this.tiles[row][col1] = null;
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
                if (this.tiles[row][col] != null) {
                    for (var col1 = col; col1 < (cols - 1); col1++) {
                        if (this.tiles[row][col1 + 1] == null) {
                            this.tiles[row][col1 + 1] = this.tiles[row][col1];
                            this.tiles[row][col1] = null;
                            this.setTilePosition(this.tiles[row][col1 + 1], row, col1 + 1);
                            isMoved = true;
                        } else if (this.tiles[row][col1 + 1].level == this.tiles[row][col1].level) {// 合并
                            this.tiles[row][col1 + 1].level += 1;
                            this.tiles[row][col1 + 1].updateLevel();
                            this.tiles[row][col1].removeFromParent();
                            this.tiles[row][col1] = null;
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
