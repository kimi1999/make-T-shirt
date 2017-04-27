// default settings. fis3 release
fis.hook('module', {
    mode: 'commonJs'
});

// Global start
fis.match('::package', {
    /*启用 fis-spriter-csssprites 插件 后面的 useSprite: true 才会生效 */
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    })
});



fis.match('main.less', {
    packTo: '/css/main.css', //css打成一个包
    parser: fis.plugin('less'),
    rExt: '.css',
});

fis.match('creatJsTest.less', {
    packTo: '/css/creatJsTest.css', //css打成一个包
    parser: fis.plugin('less'),
    rExt: '.css',
});



fis.match('*.css', {
    preprocessor: fis.plugin("cssgrace"),
    postprocessor: fis.plugin("autoprefixer"),
});
// Global end

// default media is `dev`
fis.media('dev')
    .match('*', {
        useHash: false,
        optimizer: null,
        domain: fis.get("domain")
    }).match('*.{js.css,png}', {
        useSprite: false
    });