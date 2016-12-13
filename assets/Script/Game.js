cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        tiles: [],
        manager: {
            default: null
        },
        mapBackground: cc.Sprite,
        labelBackground: cc.Prefab,
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

    /**
     * 初始化游戏背景
     */
    setupMapBackground: function () {
        this.background.node.color = this.manager.backgroundColor();
        this.mapBackground.node.color = this.manager.scoreBoardColor();

        let bgSize = this.mapBackground.node.width;
        let labelInstance = cc.instantiate(this.labelBackground);
        let labelSize = labelInstance.width;

        this.manager.tileSize.width = labelSize;
        this.manager.tileSize.height = labelSize;

        let rows = this.manager.getRowCount();
        let cols = this.manager.getColCount();

        let spaceSize = (bgSize - (cols * labelSize)) / (cols + 1);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let origin = -(bgSize / 2) + (labelSize / 2);
                let x = origin + spaceSize + i * (spaceSize + labelSize);
                let y = origin + spaceSize + j * (spaceSize + labelSize);

                let label = cc.instantiate(this.labelBackground);
                label.setPosition(x, y);
                this.mapBackground.node.addChild(label);
            }
        }
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
        switch (event.keyCode) {
            case cc.KEY.up: {
                this.moveUp();
                break;
            }
            case cc.KEY.down: {
                this.moveDown();
                break;
            }
            case cc.KEY.left: {
                this.moveLeft();
                break;
            }
            case cc.KEY.right: {
                this.moveRight();
                break;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

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
                            this.tiles[row1 + 1][col].moveTo(row1 + 1, col);
                            isMoved = true;
                        } else if (this.tiles[row1 + 1][col].num == this.tiles[row1][col].num) {// 合并
                            this.tiles[row1 + 1][col].num = parseInt(this.tiles[row1][col].num) * 2;
                            this.tiles[row1 + 1][col].updateNum();
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
        for (var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                if (this.tiles[row][col] != null) {// 有方块
                    for (var row1 = row; row1 > 0; row1--) {
                        if (this.tiles[row1 - 1][col] == null)//如果没有向下移动
                        {
                            this.tiles[row1 - 1][col] = this.tiles[row1][col];
                            this.tiles[row1][col] = null;
                            this.tiles[row1 - 1][col].moveTo(row1 - 1, col);
                            isMoved = true;
                        } else if (this.tiles[row1 - 1][col].num == this.tiles[row1][col].num) {// 合并
                            this.tiles[row1 - 1][col].num = parseInt(this.tiles[row1][col].num) * 2;
                            this.tiles[row1 - 1][col].updateNum();
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
                            this.tiles[row][col1 - 1].moveTo(row, col1 - 1);
                            isMoved = true;
                        } else if (this.tiles[row][col1 - 1].num == this.tiles[row][col1].num) {// 合并
                            this.tiles[row][col1 - 1].num = parseInt(this.tiles[row][col1].num) * 2;
                            this.tiles[row][col1 - 1].updateNum();
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
                            this.tiles[row][col1 + 1].moveTo(row, col1 + 1);
                            isMoved = true;
                        } else if (this.tiles[row][col1 + 1].num == this.tiles[row][col1].num) {// 合并
                            this.tiles[row][col1 + 1].num = parseInt(this.tiles[row][col1].num) * 2;
                            this.tiles[row][col1 + 1].updateNum();
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
