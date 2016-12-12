cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        mapBackground: cc.Sprite,
        labelBackground: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        let bgSize = this.node.width;
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
    // update: function (dt) {

    // },
});
