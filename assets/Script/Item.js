cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        label: {
            default: null,
            type: cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.label.fontSize = 50;
        this.setLevel(2);
    },

    //called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
    
    setLevel:function(toLevel) {
        this.level = toLevel;

        switch(toLevel) {
            case 0: {
                this.node.setColor(cc.color(238, 228, 218, 255));
                this.label.string = "2";
                this.label.node.color = cc.color(104, 96, 88, 255);
            }
            break;
            case 1: {
                this.node.setColor(cc.color(237, 224, 200, 255));
                this.label.string = "4";
                this.label.node.color = cc.color(118, 109, 99, 255);
            }
            break;
            case 2: {
                this.node.setColor(cc.color(242, 177, 121, 255));
                this.label.string = "8";
                this.label.node.color = cc.color(255, 255, 255, 255);
            }
            break;
        }
    },
    
    
});
