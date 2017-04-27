$(function(){
    var bkgCanvas = new myCanvas({});
    bkgCanvas.drawBackground({src: "/images/_edf0f5.png"});
    
    //bkgCanvas.addImg("/images/1242397_161645075_2.jpg");
    
    var oFReader = new FileReader(), 
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    
    oFReader.onload = function (oFREvent) {
        var p = new Image();
        p.src = oFREvent.target.result;
        bkgCanvas.addImg(p);
    };
    
    $("#uploadImage").on("change",function(){
        var oFile = document.getElementById("uploadImage").files[0],
            fileName = oFile.name,
            size = oFile.size,
            type = oFile.type;
        if (!rFilter.test(oFile.type)) { alert("请选择图片文件!"); return; }
        oFReader.readAsDataURL(oFile);
    });
    
});