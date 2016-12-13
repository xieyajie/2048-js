cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        row: 0,
        col: 0,

        label: {
            default: null,
            type: cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.label.fontSize = 50;
        this.setLevel(0);
    },

    //called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
    
    setLevel:function(toLevel) {
        this.level = toLevel;

        this.updateLevel();
    },

    updateLevel:function () {
        var Manager = require("Manager");
        var bgColor = Manager.colorForLevel(this.level);
        this.node.setColor(bgColor);

        var textColor = Manager.textColorForLevel(this.level);
        this.label.node.color = textColor;

        var num = Math.pow(Manager.cardinality, (this.level + 1));
        this.label.string = num.toString();
    },
    
});
