//请求系统配额类型
window.TEMPORARY//0  临时
window.PERSISTENT//1  持久

//当前请求存储空间，如不修改大小，只需要请求一次
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

//持久存储要用StorageInfo.requestQuota，成功回调参数为请求成功的空间
window.webkitStorageInfo.requestQuota(window.PERSISTENT,1024*1024*5,function(gratedBytes) {
  window.requestFileSystem(window.PERSISTENT, gratedBytes, successHandler, errorHandler);
}, errorHandler);

//出错回调
function errorHandler(err) {
  //console.info(typeof FileError);//不可用或已经放弃
}

function successHandler(fs) {
  //创建目录下的文件只能创建当前目录下的文件(不能直接指定路径创建文件)
  fs.root.getDirectory('Dir', { 
    create: true, //创建新文件，如果文件存在抛出异常执行errorHandle，不影响程序执行
    exclusive: true //高级文件验证
  }, function (dirEntry) {
		//选择多个文件，并复制到沙盒文件系统中
		let files = document.querySelector('input').file;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      (function (f) {
        dirEntry.getFile(file.name,{
					create:true//不指定exclusive，create=true的话,不存在创建，存在覆盖
				},
				function (fileEntry) {
          if (fileEntry.isFile) {
            fileEntry.createWriter(function (fileWriter) {

							fileWriter.onwriteend=function(e){}
							
              fileWriter.onerror = function(e){

								//指定位置，将写入指针移动到文件结尾
								fileWriter.seek(fileWriter.length);
								
                var blob = new Blob(['写入异常：'+e.toString()], {
                  type: 'text/plain'
                });
                fileWriter.write (blob);
							}
							
							fileWriter.write (f);//参数File或Blob
							
            });
            showFile (fileEntry);
          }
        }, errorHandler)
      })(file);
    }
  }, errorHandler);
}

//显示指定fileEntity中的内容
function showFile(fileEntity) {

  fileEntity.file(function (file) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
      console.log(reader.result);
    }
    reader.readAsText(file);
    console.log(fileEntry.fullPath+'文件名：' + fileEntry.name +'\r\n字节大小：' + file.size)
	});
	
}