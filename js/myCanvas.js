/**
 *  canvas 对象
 *
 */
function myCanvas(obj){
    this.canvasWidth = obj.canvasWidth || 450;
    this.canvasHeight = obj.canvasHeight || 514;
    this.bkgCanvas = obj.bkgCanvas || document.getElementById("front-image-canvas");
    this.upperCanvas = obj.upperCanvas || document.getElementById("upperCanvas");
    this.init();
}
myCanvas.prototype = {
    init : function(){
        this.bkgContext = this.bkgCanvas.getContext("2d");
        this.upperContext = this.upperCanvas.getContext("2d");
        
        this.upperImgsX = 20;
        this.upperImgsY = 20;
        this.upperImgsWidth = 91;
        this.upperImgs = [];
        
        
        return this;
    },
    drawBackground : function(p){
        var pic = new Image(),
            imgX = p.imgX || 0,
            imgY = p.imgY || 0,
            imgWidth = p.imgWidth || 450,
            imgHeight = p.imgHeight || 514,
            strokeX = p.strokeX || 124,
            strokeY = p.strokeY || 96,
            strokeWidth = p.strokeWidth || 202,
            strokeHeight = p.strokeHeight || 381;
        pic.src = p.src || "";
        this.bkgContext.drawImage(pic,imgX,imgY,imgWidth,imgHeight);/*canvas 填充背景图片*/
        this.bkgContext.strokeRect(strokeX,strokeY,strokeWidth,strokeHeight);/*canvas 画矩形边框*/
        /*this.bkgContext.fillRect(40,40,100,100); // canvas 画填充矩形  */
        return this;
    },
   addImg : function(p){
       var imgW = 162,/*图片的最佳位置 是 距离边框两边 各20像素 这个可按需求修改 this.upperImgsX*/ 
           imgH = (imgW*p.height)/p.width;
       this.upperContext.drawImage(p,this.upperImgsX,this.upperImgsY,imgW,imgH);
       var self = this;
       
       this.mouseDowned = false;
       this.mouseLastX = 0;
       this.mouseLastY = 0;
       $(this.upperCanvas).on("mousemove",function(e){
           var ofX = e.offsetX,
               ofY = e.offsetY;
           if(ofX>=self.upperImgsX && ofX<=(self.upperImgsX+imgW) && ofY>=self.upperImgsY && ofY<=(self.upperImgsY+imgH)){
               $(this).css({"cursor":"move"});
               if(ofX>=(self.upperImgsX+imgW-40) && ofY>=(self.upperImgsY+imgH-40)){
                   /* 鼠标在  */
                   $(this).css({"cursor":"se-resize"});
               }
               if(self.mouseDowned){
                   self.upperContext.clearRect(self.upperImgsX,self.upperImgsY,imgW,imgH);
                   self.upperImgsX += (ofX-self.mouseLastX);
                   self.upperImgsY += (ofY-self.mouseLastY);
                   self.upperContext.drawImage(p,self.upperImgsX,self.upperImgsY,imgW,imgH);
               }
               self.mouseLastX = ofX;
               self.mouseLastY = ofY;
           }
           else{
              $(this).css({"cursor":"default"}); 
           }
       })
       .on("mousedown",function(e){
           var ofX = e.offsetX,
               ofY = e.offsetY;
           if(ofX>=self.upperImgsX && ofX<=(self.upperImgsX+imgW) && ofY>=self.upperImgsY && ofY<=(self.upperImgsY+imgH)){
               self.mouseDowned = true;
           }
           else{
               self.mouseDowned = false;
           }
       })
        .on("mouseup",function(){
           self.mouseDowned = false;
       })
       .on("mouseleave",function(){
           self.mouseDowned = false;
       });
       return this;
   } 
}
