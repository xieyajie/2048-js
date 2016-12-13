cc.Class({
    extends: cc.Component,

    statics: {
        cardinality: 2,

        tileSize:{
            width: 130,
            height: 130
        },

        backgroundColor: function () {
            return cc.color(250, 248, 239, 255);
        },

        scoreBoardColor: function () {
            return cc.color(187, 173, 160, 255);
        },

        buttonColor: function () {
            return cc.color(119, 110, 101, 255);
        },

        colorForTag: function (tag) {
            var retColor = cc.color(255, 255, 255, 255);

            switch(tag) {
                case 0: {
                    retColor = cc.color(238, 228, 218, 255);
                }
                    break;
                case 1: {
                    retColor = cc.color(237, 224, 200, 255);
                }
                    break;
                case 2: {
                    retColor = cc.color(242, 177, 121, 255);
                }
                    break;
                case 3: {
                    retColor = cc.color(245, 149, 99, 255);
                }
                    break;
                case 4: {
                    retColor = cc.color(246, 124, 95, 255);
                }
                    break;
                case 5: {
                    retColor = cc.color(246, 94, 59, 255);
                }
                    break;
                case 6: {
                    retColor = cc.color(237, 207, 114, 255);
                }
                    break;
                case 7: {
                    retColor = cc.color(237, 204, 97, 255);
                }
                    break;
                case 8: {
                    retColor = cc.color(237, 200, 80, 255);
                }
                    break;
                case 9: {
                    retColor = cc.color(237, 197, 63, 255);
                }
                    break;
                case 10: {
                    retColor = cc.color(237, 194, 46, 255);
                }
                    break;
            }

            return retColor;
        },


        textColorForTag: function (tag) {
            var retColor = cc.color(255, 255, 255, 255);

            switch(tag) {
                case 0:
                case 1: {
                    retColor = cc.color(118, 109, 100, 255);
                }
                    break;
            }

            return retColor;
        },

        getRowCount:function () {
            var num = 4;
            switch (this.cardinality) {
                case 3:
                    num = 3;
                    break;
                case 5:
                    num = 5;
                    break;
            }

            return num;
        },

        getColCount:function () {
            var num = 4;
            switch (this.cardinality) {
                case 3:
                    num = 3;
                    break;
                case 5:
                    num = 5;
                    break;
            }

            return num;
        }
        
    }
});
