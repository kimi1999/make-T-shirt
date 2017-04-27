/**
 * describle ： container 生成器 （每调用一次生成一个可在canvas上操作的容器）
 * author ： luckyzhangxf@163.com
 * date：2016/03/01
 * params : obj = {
 
            id : 345666, //新增的container的id  number或string   （可选）
            baseContainer : baseContainer, //位图将要绘制的 层级比较低的容器  Object  （必须）
            img : img, //需要绘制的图片 需要绘制的图片或图片路径  Object或string  （必须）
            handleStage : handleStage, //舞台  新增的容器 和其他多有的容器公用这一个舞台  Object  （必须）
            imgData : {//图片默认的一些信息  Object（必须）
                x : 10,//图片在舞台的 右上角x坐标  （必须）
                y : 10,//图片在舞台的 右上角y坐标   （必须）
                w : 200,//图片的默认显示宽度；若图片宽度小于200px时为图片自身的宽度  （必须）
                h : 400//图片显示的默认最大高度； 若按宽度w缩放后的图片高度大于h 则图片的宽高 重新按照h计算  （必须）
            }, 
            callBack : callBack, //每隔20毫秒会调用一次的回调函数去刷新舞台   function  （必须）
            removeCallBack : removeCallBack //删除当前容器后的回调函数  function （可选）
            
        } 
 *
 */

function creContainer(obj){
    this.id = obj.id || ("container"+new Date().getTime());
    this.baseContainer = obj.baseContainer;
    this.img = obj.img;
    this.handleStage = obj.handleStage;
    this.imgCanvasOffset = obj.imgCanvasOffset;
    this.callBack = obj.callBack;
    this.imgData = obj.imgData;
    this.removeCallBack = obj.removeCallBack || null;
    
    this.update = false;
    this.moveType = "new";
    this.container = new createjs.Container();
    this.handleStage.addChild(this.container);
    this.init().drawing().bindEvent();
}
creContainer.prototype = {
    init : function(){
        var self = this;
        setInterval(function(){
            if(self.update){
                self.callBack(self.update);
                self.update = false;
            }
        },20);
        this.lastMousePosition = {x:0,y:0};
        
        this.bitmap = new createjs.Bitmap(this.img);
        this.imgWidth = this.bitmap.image.width;
        this.imgHeight = this.bitmap.image.height;
        if(!this.imgWidth){
            console.log("作者： luckyzhangxf@163.com");
            if(document.getElementById("preImg")){
                var preImg = document.getElementById("preImg");
                this.imgWidth = preImg.offsetWidth;
                this.imgHeight = preImg.offsetHeight;
            }
        }
        
        this.imgInitData={
            x : this.imgData.x,y : this.imgData.y,
            width : (this.imgWidth>=this.imgData.w?this.imgData.w:this.imgWidth),
            w_h : this.imgWidth/this.imgHeight
        };
        var imgScale = this.imgInitData.width/this.imgWidth,
            nowImgHeight = this.imgInitData.width/this.imgInitData.w_h;
        if(nowImgHeight>this.imgData.h){
            /*对长图的处理*/
            imgScale = this.imgData.h/this.imgHeight;
            this.imgInitData.width = this.imgInitData.w_h*this.imgData.h;
        }
        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale = imgScale;
        
        
        this.rotation = 0;
        this.scaleDistance = 0;
        this.container.middle = {};
        this.resetContainerData();
        return this;
    },
    bindEvent : function(){
        var self = this;
        var setMoveType = function(e){
            if(self.moveType = "scale"){
                self.container.regX = self.boxData.w/2;
                self.container.regY = self.boxData.h/2;
                self.container.x = self.boxData.point.middle.x;
                self.container.y = self.boxData.point.middle.y;
            }
            self.imgInitData.middle = {
                x : self.boxData.point.middle.x-e.stageX,
                y : self.boxData.point.middle.y-e.stageY
            }
            self.moveType = "move";
        }
        /* 1. 鼠标在容器 移动按钮上点击*/
        this.btn_move.on("mousedown",function(e){
            setMoveType(e);
        });
        /* 2. 鼠标在容器 主题区域点击*/
        this.shape.on("mousedown",function(e){
            setMoveType(e);
        });
        /* 3. 鼠标在容器 旋转按钮上点击*/
        this.btn_rotate.on("mousedown",function(e){
            self.lastMousePosition.x = e.stageX;
            self.lastMousePosition.y = e.stageY;
            self.moveType = "rotate";
        });
        /* 4. 鼠标在容器 删除按钮上点击*/
        this.btn_delete.on("mousedown",function(e){
            self.moveType = "delete";
            self.destroyContainer();
        });
        /* 5. 鼠标在容器 缩放按钮上点击*/
        this.btn_scale.on("mousedown",function(e){
            self.lastMousePosition = {x : e.stageX, y : e.stageY};
            var disd = getPointDistance(self.boxData.point.l_t_real,self.lastMousePosition);
            self.scaleDistance = disd;
            self.moveType = "scale";
        });
        /* 6. 鼠标在容器 左右区域点击 显示四个操作按钮*/
        this.container.on("mousedown",function(e){
            self.showBtns();
            self.mouseIn = true;
        });
        /* 7. 鼠标在容器 范围内时 做下标记*/
        this.container.on("mouseover",function(e){
            self.mouseIn = true;
        });
        /* 8. 鼠标不在容器 范围内时 删除标记*/
        this.container.on("mouseout",function(e){
            self.mouseIn = false;
        });
        /* 9. 鼠标在容器 任意区域按下鼠标并移动鼠标时*/
        this.container.on("pressmove",function(e){
            var ePosition = {x:e.stageX,y:e.stageY};
            switch(self.moveType){
                case "move":
                    self.container.middle.x = e.stageX + self.imgInitData.middle.x;
                    self.container.middle.y = e.stageY + self.imgInitData.middle.y;
                    self.drawing();
                    break;
                case "rotate":
                    if(true){
                        
                    var middlePoint = self.boxData.point.middle,
                        rotation = getDegreeOfThreePoint(middlePoint,self.lastMousePosition,ePosition),
                        type= -1;/*-1 逆时针旋转 ； 1 顺时针旋转*/
                    if(self.lastMousePosition.x>middlePoint.x){
                        if(e.stageY>self.lastMousePosition.y)type = 1;
                    }
                    else{
                        if(e.stageY<self.lastMousePosition.y)type = 1;
                    }
                    if(self.lastMousePosition.y>middlePoint.y){
                        if(e.stageX<self.lastMousePosition.x) type = 1;
                    }
                    else{
                        if(e.stageX>self.lastMousePosition.x)type = 1;
                    }
                    if(type==1){/* 顺时针旋转 */
                        self.rotation += rotation;
                    }
                    else{/* 逆时针旋转 */
                        self.rotation -= rotation; 
                    }
                    self.container.rotation = self.rotation<=-360 ? (self.rotation+360) : (self.rotation>=360 ? (self.rotation-360) : self.rotation);
                    self.lastMousePosition = ePosition;
                    self.drawing();
                        
                    }
                    break;
                case "scale":
                    if(true){
                        
                    var addW = 0,
                        changX = 0,
                        changeY = 0,
                        xDisd = Math.abs(ePosition.x-self.lastMousePosition.x),
                        yDisd = Math.abs(ePosition.y-self.lastMousePosition.y),
                        nowDistance = getPointDistance(self.boxData.point.l_t_real,ePosition);
                       
                    if(xDisd>=yDisd){
                        addW = xDisd;
                    }
                    else{
                        addW = yDisd*self.imgInitData.w_h;
                    }
                    if(nowDistance>self.scaleDistance){
                        /*放大*/
                        self.imgInitData.width += addW;
                        changX = addW;
                        changeY = addW/self.imgInitData.w_h;
                    }
                    else{
                         /*缩小*/
                        var minDisrance = getPointDistance(self.boxData.point.l_t_real,self.boxData.point.r_b_real);
                        if(minDisrance<=30)return;/*图片允许缩小的最小时 返回*/
                        self.imgInitData.width -= addW;
                        changX = -addW;
                        changeY = -addW/self.imgInitData.w_h;
                        
                    }
                    self.bitmap.scaleX = self.bitmap.scaleY = self.bitmap.scale = self.imgInitData.width/self.imgWidth;
                    self.lastMousePosition = ePosition;
                    self.scaleDistance = nowDistance;
                    self.drawing({x:changX,y:changeY});
                    break;
                        
                    }
            }
        });
    },
    /* 重绘容器 */
    drawing : function(changeData){
        var w = 20;
        var self = this;
        self.resetContainerData();
        this.bitmap.regX = this.imgWidth/2;
        this.bitmap.regY = this.imgHeight/2;
        this.bitmap.x = this.boxData.point.middle.x-this.imgCanvasOffset.x;
        this.bitmap.y = this.boxData.point.middle.y-this.imgCanvasOffset.y;
        this.bitmap.rotation = this.boxData.rotation;
        if(this.moveType=="new"){
            this.container.regX = this.boxData.w/2;
            this.container.regY = this.boxData.h/2;
            this.container.x = this.boxData.point.middle.x;
            this.container.y = this.boxData.point.middle.y;
            this.baseContainer.addChild(this.bitmap);
            
            
            this.shape = new createjs.Shape();
            this.shape.graphics.beginFill("#fff").drawRect(0, 0, this.imgWidth, this.imgHeight);
            this.shape.scaleX = this.shape.scaleY = this.shape.scale = this.bitmap.scale;
            this.shape.alpha = 0.01;
            this.shape.cursor = "move";
            this.container.addChild(this.shape); 
            this.bitmap.cursor = "move";
            var g = new createjs.Graphics();
            g.setStrokeStyle(2);
            g.beginStroke("#000000").drawRect(0, 0, this.imgWidth, this.imgHeight);
            this.imgBorder = new createjs.Shape(g);
            this.imgBorder.scaleX = this.imgBorder.scaleY = this.imgBorder.scale = this.bitmap.scale;
            this.container.addChild(this.imgBorder); 
            
            /***** 画四个角的操作按钮 *****/
            this.rightBottomPoint = new createjs.Bitmap("images/dott.png"); 
            this.btn_move = new createjs.Bitmap("images/btn-move.png"),
            this.btn_rotate = new createjs.Bitmap("images/btn-rotate.png"),
            this.btn_delete = new createjs.Bitmap("images/btn-delete.png"),
            this.btn_scale = new createjs.Bitmap("images/btn-scale.png");
            this.rightBottomPoint.name = "rightBottomPoint";
            this.btn_move.name="btn_move";   
            this.btn_rotate.name="btn_rotate";
            this.btn_delete.name="btn_delete";
            this.btn_scale.name="btn_scale";
            this.container.addChild(this.rightBottomPoint);
            this.container.addChild(this.btn_move);
            this.container.addChild(this.btn_rotate);
            this.container.addChild(this.btn_delete);
            this.container.addChild(this.btn_scale);
            this.resetBtns();
            var scale = w/this.btn_move.image.width;
            this.btn_move.scaleX = this.btn_move.scaleY = this.btn_move.scale =scale;
            this.btn_move.cursor = "move";
            this.btn_rotate.scaleX = this.btn_rotate.scaleY = this.btn_rotate.scale =scale
            this.btn_rotate.cursor = "pointer";
            this.btn_delete.scaleX = this.btn_delete.scaleY = this.btn_delete.scale = scale 
            this.btn_delete.cursor = "pointer";
            this.btn_scale.scaleX = this.btn_scale.scaleY = this.btn_scale.scale = scale
            this.btn_scale.cursor = "pointer";
        }
        if(this.moveType=="move"){
            this.container.x = this.boxData.point.middle.x;
            this.container.y = this.boxData.point.middle.y;
        }
        if(this.moveType=="scale"){
            this.resetBtns(changeData);
        }
        if(this.moveType=="rotate"){
            this.container.regX = this.boxData.w/2;
            this.container.regY = this.boxData.h/2;
            this.container.x = this.boxData.point.middle.x;
            this.container.y = this.boxData.point.middle.y;
        }
        this.update = true;
        return this;
        
    },
    /*重置容器数据*/
    resetContainerData : function(){
        var X = this.imgInitData.x,
            Y = this.imgInitData.y,
            imgH = this.imgHeight,
            imgW = this.imgWidth,
            scale = this.bitmap.scale,
            l_t_point = this.container.getConcatenatedMatrix(),
            r_b_realX = X+imgW*scale,
            r_b_realY = Y+imgH*scale,
            middleX = X+imgW*scale/2,
            middleY = Y+imgH*scale/2;
        if(this.moveType!="new"){
            var r_b_point = this.rightBottomPoint.getConcatenatedMatrix();
            middleX = (r_b_point.tx+l_t_point.tx)/2;
            middleY = (r_b_point.ty+l_t_point.ty)/2;
            r_b_realX = r_b_point.tx;
            r_b_realY = r_b_point.ty;
        }
        if(this.moveType=="move"){
            middleX = this.container.middle.x;
            middleY = this.container.middle.y;
        }
        this.boxData = {
                point : {
                    l_t:{ x:middleX-imgW*scale/2, y:middleY-imgH*scale/2 },/*左上角 未旋转时的坐标*/
                    l_t_real:{ x:l_t_point.tx, y:l_t_point.ty},/*左上角 旋转后真实的坐标*/
                    r_b_real:{ x:r_b_realX, y:r_b_realY},/*右下角 旋转后真实的坐标*/
                    middle:{ x:middleX, y:middleY}/*图片中心 未旋转时的坐标*/
                },
                w : this.imgInitData.width,
                h : imgH*scale,
                rotation : this.rotation,
                scale : scale
            }
        if(this.moveType!="new"){
            this.shape.scaleX = this.shape.scaleY = this.shape.scale = this.boxData.scale;
            this.imgBorder.scaleX = this.imgBorder.scaleY = this.imgBorder.scale = this.boxData.scale;
        }
        return this;
    },
    /* 显示四个操作按钮 */
    showBtns : function(){
        this.rightBottomPoint.alpha = 1;
        this.btn_move.alpha = 1;
        this.btn_rotate.alpha = 1;
        this.btn_delete.alpha = 1;
        this.btn_scale.alpha = 1;
        this.imgBorder.alpha = 1;
        this.update = true;
        return this;
    },
    /* 隐藏四个操作按钮 */
    hideBtns : function(){
        if(this.mouseIn) return;
        this.rightBottomPoint.alpha = 0;
        this.btn_move.alpha = 0;
        this.btn_rotate.alpha = 0;
        this.btn_delete.alpha = 0;
        this.btn_scale.alpha = 0;
        this.imgBorder.alpha = 0;
        this.update = true;
        return this;
    },
    /* 重置四个操作按钮 */
    resetBtns : function(changeData){
        var w = 20;
        if(changeData){/*缩放的时候 重置四个按钮的位置*/
            this.btn_rotate.x += changeData.x;
            this.btn_delete.y += changeData.y;
            this.btn_scale.x += changeData.x;
            this.btn_scale.y += changeData.y;
            this.rightBottomPoint.x += changeData.x;
            this.rightBottomPoint.y += changeData.y;
            return this;
        }
        else{/*初始化的时候 设置四个按钮的位置*/
            this.btn_move.x = -w/2;
            this.btn_move.y = -w/2;
            this.btn_rotate.x = this.boxData.w-w/2;
            this.btn_rotate.y = -w/2;
            this.btn_delete.x = -w/2;
            this.btn_delete.y = this.boxData.h-w/2;
            this.btn_scale.x = this.boxData.w-w/2;
            this.btn_scale.y = this.boxData.h-w/2;
            this.rightBottomPoint.x = this.boxData.w;
            this.rightBottomPoint.y = this.boxData.h;
            return this;
        }
    },
    /*销毁容器*/
    destroyContainer : function(){
        this.container.removeAllChildren();
        this.baseContainer.removeChild(this.bitmap);
        if(this.removeCallBack){
            this.removeCallBack();
        }
        return this;
    }
}


/************************** 工具函数 start **************************/
/**
  * 1. 计算两个点之间的距离
  * 描述： 计算P1{x:x,y1:y1} 到 P2{x:x2,y:y2} 之间的线段长度
  * params ： p1,p2   Object  形如 {x:20,y:100}
  * return ： 返回p1,p2两点之间的距离   Number 
  */ 
function getPointDistance(p1,p2){
    return Math.sqrt((p1.y-p2.y)*(p1.y-p2.y)+(p1.x-p2.x)*(p1.x-p2.x));
}

/**
  * 2. 计算一个点 相对于中心点 移动到另一个点所旋转的角度
  * 描述： 计算O{x:x0,y:y0} 为中心点 P1{x:x,y1:y1} 旋转到 P2{x:x2,y:y2} 的夹角
  * params ： o,p1,p2   Object  形如 {x:20,y:100}
  * return ： 返回角度   Number  （90 代表90度）
  */   
function getDegreeOfThreePoint(o,p1,p2){
    var a = getPointDistance(o,p1);
    var b = getPointDistance(o,p2);
    var c = getPointDistance(p1,p2);
    var cosC = (a*a+b*b-c*c)/(2*a*b);
    var rDegree = Math.acos(cosC)*180/Math.PI;
    return rDegree;
}
/************************** 工具函数 end **************************/

