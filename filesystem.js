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
	//参数DOMFileSystem文件系统对象表示一个应用可访问的根目录，用于管理特定本地文件目录。name属性用于标识当前沙盒系统根目录名称，协议、域名、端口+操作类型，与LocalFileSystem中的文件系统类型一一对应。root属性为文件目录对象，用于实际操作文件系统，DirectoryEntry
	
  //创建目录下的文件只能创建当前目录下的文件(不能直接指定路径创建文件)
  fs.root.getDirectory('Dir', { 
    create: true, //创建新文件，如果文件存在抛出异常执行errorHandle，不影响程序执行
    exclusive: true //高级文件验证
  }, function (dirEntry) {
		// DirectoryEntry对象属性
		// 1.name:文件名称，包括扩展名
		// 2.fullPath:相对沙盒根目录的全名称
		// 3.isFile：是否是文件,FileEntry对象固定为true
		// 4.isDirectory：是否是文件夹，FileEntry对象固定为false
		// 5.filesystem:当前fs（FileSystem对象）的引用

		//选择多个文件，并复制到沙盒文件系统中
		let files = document.querySelector('input').file;
    for (let i = 0; i < files.length; i++) {
			let file = files[i];
			// File对象是文件系统中的文件数据对象，用于获取文件的数据，包含四个属性
			// size: 文件数据对象的数据大小，单位为字节
			// type: 文件数据对象MIME类型
			// name: 文件数据对象的名称，不包括路径
			// lastModifiedDate: 文件对象的最后修改时间
			// file.slice(start, end)获取文件指定的数据内容
			// file.close()当文件数据对象不再使用时，可通过此方法关闭文件数据对象，释放系统资源

      (function (f) {
				// DirectoryEntry方法1 创建或打开文件
        dirEntry.getFile(file.name,{
					create:true//不指定exclusive，create=true的话,不存在创建，存在覆盖
				},
				function (fileEntry) {
					// FileEntry对象属性同DirectoryEntry

					
					// fileEntry.getMetadata(successCallback, opt_errorCallback); 获取文件或目录状态信息成功的回调函数返回Metadata对象，modificationTime: (Date 类型 )文件或目录的最后修改时间。size文件的大小，若获取的是目录对象的属性则值为0。directoryCount: (Number 类型 )包含的子目录数，若自身是文件则其值为0。fileCount: (Number 类型 )目录的文件数，若自身是文件则其值为0。测试时不可用

					// fileEntry.remove(successCallback, opt_errorCallback);

					// fileEntry.moveTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback); 以下情况移动目录将会导致失败： 要移动到的目标目录无效； 要移动到的目标路径被其它文件占用；成功回调函数中的参数保存新的文件对象

					// fileEntry.copyTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);  

					// fileEntry.getParent(successCallback, opt_errorCallback);  

					// fileEntry.toURL(opt_mimeType);返回‘filesytem:http://’格式

					// fileEntry.file(successCallback, opt_errorCallback)

          if (fileEntry.isFile) {
						//获取文件关联的写文件操作对象FileWriter
            fileEntry.createWriter(function (fileWriter) {
							// 1.readyState:当前文件读取写入状态，常量值如下：
								// INIT: 0，
								// WRITING: 1，
								// DONE: 2，
							// 2.position：当前操作指针位置
							// 3.length：当前写入文件的长度，字节数
							// 4.error：异常
							// onwritestart: 写入文件开始时的回调函数
							// onprogress: 写入文件过程中的回调函数
							// onwrite: 写入文件成功完成的回调函数
							// onabort: 取消写入文件时的回调函数
							// onwriteend: 文件写入操作完成时的回调函数
              fileWriter.onerror = function(e){

								//指定位置，将写入指针移动到文件结尾。不指定则从文件当前定位的位置开始，写入数据到文件中。 如已经存在数据则覆盖
								fileWriter.seek(fileWriter.length);
								
                let blob = new Blob(['异常：'+e.toString()], {
                  type: 'text/plain'
								});

								//File对象，Blob对象，DOMString类型
								fileWriter.write (blob);

								fileWriter.truncate(0)//按照指定长度截断文件

								fileWriter.abort()

							}
							
							fileWriter.write (f);//参数File或Blob
							
            }, errorHandler);
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
		
	});
}