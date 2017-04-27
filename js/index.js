$(function(){
    var update = false,/* 是否更新舞台 */
        containerList = [],/* 舞台中增加的容器列表 */
        imgInputIdList = [], /*图片 id列表*/
        allowMultiImg = true,/* 是否允许添加多张图片 */
        allowMask = true,/*是否支持 异形*/
        baseCanvas = $("#baseCanvas")[0],/*  */
        imgCanvas = $("#imgCanvas")[0],/*  */
        handleCanvas = $("#handleCanvas")[0],/*  */
        imgCanvasOffset = {
            x : 120,
            y : 150,
            w : 210,
            h : 239
        },/*绘制用户上传的图片的 canvas相对于 背景图片canvas的 偏移量*/
        backgroundContainer = new createjs.Container(),/* T恤背景图片画在这个container 里面*/
        baseContainer = new createjs.Container(),/*图片画在这个container 里面*/
        maskContainer = new createjs.Container(),/*异形图 画在这个container 里面*/
        handleStage = new createjs.Stage(handleCanvas),/*操作绘画的 舞台*/
        imgStage = new createjs.Stage(imgCanvas),/*绘画的 舞台*/
        baseStage = new createjs.Stage(baseCanvas);/* 背景图片的 舞台 */
    
    $(imgCanvas).css({"left":imgCanvasOffset.x+"px","top":imgCanvasOffset.y+"px"});
    imgCanvas.width = imgCanvasOffset.w;
    imgCanvas.height = imgCanvasOffset.h;
    handleStage.enableMouseOver(10);
    handleStage.mouseMoveOutside = true;
    imgStage.enableMouseOver(10);
    baseStage.enableMouseOver(10);
    
    baseStage.addChild(backgroundContainer);
    imgStage.addChild(baseContainer);
    imgStage.addChild(maskContainer);
    document.getElementById("TBgImg").src = "images/_edf0f5.png";
    /******** 绘制T恤背景图片 *******/
    document.getElementById("TBgImg").onload = function(){
        backgroundContainer.removeAllChildren();
        var bgX = 0,
            bgY = 0,
            bgW = 450,
            bgH = 514,
            bitmap = new createjs.Bitmap(this.src),
            imgWidth = bitmap.image.width,
            imgHeight = bitmap.image.height;
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = bgW/imgWidth;
        backgroundContainer.addChild(bitmap);
        tick(true);
        $(".loading-cont").hide();
    }
    
    if(allowMask){
        document.getElementById("imgCanvas").style.border = "none";
        document.getElementById("maskImg").src = "images/A_05_004.png";
        /******** 绘制异形图 *******/
        document.getElementById("maskImg").onload = function(){
            maskContainer.removeAllChildren();
            var bgW = 210,
                bitmap = new createjs.Bitmap(this.src),
                imgWidth = bitmap.image.width,
                imgHeight = bitmap.image.height;
            bitmap.scaleX = bitmap.scaleY = bitmap.scale = bgW/imgWidth;
            maskContainer.addChild(bitmap);
            tick(true);
        }
    }
                
    /****************** html5 图片本地预览 start *****************/
    var oFReader = new FileReader(), 
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    oFReader.onload = function (oFREvent){
        var p = new Image();
        p.src = oFREvent.target.result;
        if(document.getElementById("preImg")){
            document.getElementById("preImg").src = oFREvent.target.result;
            /*图片加载完成后 隐藏等待弹层 在canvas上绘制图像*/
            document.getElementById("preImg").onload = function(){
                $(".loading-cont").hide();
                var ctn = new creContainer({
                    id : imgInputIdList[imgInputIdList.length-1],
                    imgCanvasOffset : imgCanvasOffset,
                    handleStage : handleStage,
                    baseContainer : baseContainer,
                    img : p,
                    imgData : {
                        x : 150,
                        y : 170,
                        w : 100,
                        h : 200
                    },
                    callBack : function(update){
                        tick(update);
                    },
                    removeCallBack : function(){/*删除当前 图片*/
                        removeThisContainer(this.id);
                    }
                });
                containerList.push(ctn);
            }
        }
    };
    var preloadImg = function(inputData){
        var oFile = inputData[0].files[0],
            fileName = oFile.name,
            size = oFile.size,
            type = oFile.type;
        if (!rFilter.test(oFile.type)) { alert("请选择图片文件!"); return; }
        oFReader.readAsDataURL(oFile);
        if(!allowMultiImg){
            imgInputIdList.pop();
            if(containerList[0]){
                containerList[containerList.length-1].destroyContainer();
            }
        }
        imgInputIdList.push(inputData.attr("id"));
    }
    /****************** html5 图片本地预览 end *****************/
    
    
    
    /********* 1. 更新舞台 ********/
    var tick = function(update){
        if (update) {
			baseStage.update(event);
            imgStage.update(event);
            handleStage.update(event);
		}
    }
    //createjs.Ticker.addEventListener("tick", tick);
    
    
    /********* 2. 点击其他区域 隐藏当前图片的 移动/旋转/放大/删除按钮 ********/
    $("body").on("click",function(){
        for(var i=0; i<containerList.length; i++){
            containerList[i].hideBtns();
        }
    });

    
    /********* 3. 上传图片按钮 点击 ********/
    $(".upImgBtn").on("click",function(){
        $(".btn-cont input.imgIuput").trigger("click");
    });
    
    /********* 4. 图片输入框 文件发生变化时 ********/
    $(".btn-cont").delegate($("input"),"change",function(){
        $(".loading-cont").show();
        preloadImg($(".btn-cont input.imgIuput"));
        if(allowMultiImg){
            $(".btn-cont input.imgIuput").remove();
            var ninpId = "imgIuput"+ new Date().getTime(),
               ninpHtml = '<input type="file" style="display: none;" class="imgIuput" id="'+ninpId+'">';
            $(".btn-cont").append(ninpHtml);
        }
    });
    
    
    /*删除指定 图片的容器*/
    var removeThisContainer = function(id){
        for(var i=0; i<containerList.length; i++){
            if(containerList[i].id==id){
                containerList.splice(i,1);
            }
        }
    }
    
});