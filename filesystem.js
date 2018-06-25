// FileSystemAPI 目录文件系统访问
// 网络应用可以创建、读取、导航用户本地文件系统中的沙盒部分以及向其中写入数据
// API:DirectoryReader,FileEntry/DirectoryEntry,FileSystem,LocalFileSystem


// Chrome使用基于webkitStorageInfo新API请求存储
// 如果使用持久存储，需要使用requestQuota
// 用户授予许可后，就不必再调用requestQuota了
// 如果修改了请求配额大小，会再次弹出提示框，提示用户授权。
// 参数为请求成功的空间,后续调用为无操作指令
// 查询源的当前配额使用情况和分配情况：window.webkitStorageInfo.queryUsageAndQuota()
window.webkitStorageInfo.requestQuota(window.PERSISTENT,1024*1024*5,function(gratedBytes) {

	// 网络应用可通过调用requestFileSystem请求对沙盒文件系统的访问权限
	// 这是沙箱文件系统，一个网络应用无法访问另一个应用的文件
	// 首次调用系统会为您的应用创建新的存储空间，如不修改大小只需请求一次
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  window.requestFileSystem(

		//请求系统配额类型
		//TEMPORARY存储的数据由浏览器自行决定删除
		//清除PERSISTENT存储，须获得用户或应用明确授权，并需用户向您的应用授予配额
		window.PERSISTENT, //1 永久

		gratedBytes, //引用需要用于存储的大小（单位：字节）
		DirectoryHandler, 
		errorHandler);
}, errorHandler);

function errorHandler(err) {//只有返回异常的文本内容
  //console.info(typeof FileError);//不可用或已经放弃
}

function DirectoryHandler(fs) {
	//参数DOMFileSystem文件系统对象表示一个应用可访问的根目录，用于管理特定本地文件目录。name属性用于标识当前沙盒系统根目录名称，协议、域名、端口+操作类型，与LocalFileSystem中的文件系统类型一一对应。root属性为文件目录对象，用于实际操作文件系统，DirectoryEntry
	

	// 1.DirectoryEntry.createReader
	// 创建目录读取对象DirectoryReader,读取目下的文件及子目录
	var directoryReader = fs.root.createReader();
	var entries = [];
	var readEntries = function () {
		//一次读取内容的个数不一定
		directoryReader.readEntries(function (results) {
			//回调函数中返回FileEntry或者DirectoryEntry的数组
			if (!results.length) {
				showEntries(entries.sort());
			} else {
				entries = entries.concat([...results]);
				readEntries();
			}
		}, errorHandler);
	}
	readEntries();

	// 2. DirectoryEntry.getDirectory(path, flag, succesCB, errorCB)
	// 创建或打开子目录，只能创建当前目录下的文件，不能直接指定路径创建文件
	// path: ( DOMString ) 必选 要操作目录相对于当前目录的地址
	// flag: ( Flags ) 要操作文件或目录的参数
	// succesCB: ( EntrySuccessCallback ) 创建或打开目录成功的回调函数
	// errorCB: ( FileErrorCallback) 创建或打开目录失败的回调函数
  //创建目录下的文件只能创建当前目录下的文件(不能直接指定路径创建文件)
  fs.root.getDirectory('Dir', { //JSON对象，获取文件操作的参数
    create: true, //如果文件或目录不存在时是否进行创建，默认false
    exclusive: true //反向操作标记，本身没任何效果，需与create属性值设置为true时一起使用，如果目标文件或目录已经存在则抛出异常，不影响程序执行，默认值为false
  }, function (DirectoryEntry) {

		// 3.DirectoryEntry.removeRecursively( succesCB, errorCB )
		// 递归方式删除目录及子目录，如目录中有文件也直接删除
		// 不能删除根目录，如果操作删除根目录将会删除目录下的文件及子目录，不会删除根目录自身
		dirEntry.removeRecursively(function () {
			console.log('删除目录成功：' + dirEntry.name);
		}, errorHandler);

	}, errorHandler);

	//创建子目录，在使用getDirectory()创建父目录不存在的目录，将引发异常,为了使用方便以递归的方式，添加各个子目录
	var path = 'musi/genres/jazz/';
	function createDir(rootDirEntry, folders) {
		if (folders[0] == '.' || folders[0] == '') {
			folders.shift();
		}
		rootDirEntry.getDirectory(folders.shift(), { create: true }, function (dirEntry) {
			folders.length && createDir(dirEntry, folders);
			}
		}, errorHandler)
	}
	createDir(fs.root, path.split('/'));

	// 4.DirectoryEntry.remove( succesCB, errorCB );
	// 说明：以下情况删除目录将会导致失败： 目录中存在文件； 删除根目录；
	// 删除目录，子目录创建需要递归，获取可以直接指定'/'
	// 如果子目录不存在，抛出删除异常
	fs.root.getDirectory(path, {}, function (dirEntry) {
		dirEntry.remove(function () {
			console.log('删除目录成功');
		}, errorHandler);
	},errorHandler)

	fs.root.getDirectory('txt_1', { create: false }, function (dirEntry) {
		// DirectoryEntry.copyTo( parent, newName, succesCB, errorCB )
		// 复制移动操作，如果没有提供新名字，系统默认使用原名
		// 以下情况拷贝目录将会导致失败：将父目录拷贝到子目录中；要拷贝到的目标目录无效；要拷贝到的目标路径被文件占用；要拷贝到的目标目录已经存在且不为空
    dirEntry.copyTo(fs.root, 'txt_2', function (dirEntiry2) {

			// DirectoryEntry.moveTo( parent, newName, succesCB, errorCB )
      //移动目录
      dirEntry.moveTo(dirEntry2, 'txt_1_move', function (dirEntry) {
        console.log('移动目录成功：' + dirEntry.fullPath);
        //6重命名,如果移动的目录相同，名字不同，当做重命名处理
        fileEntry.moveTo(fs.root, 'txt_2_rename');
      }, errorHandler);
    }, errorHandler);
	}, errorHandler)
}


function showEntries(entries) {

	var fragment = document.createDocumentFragment(),
			liNode = document.createElement('li');
	
  entries.forEach(function (entry, i) {

		var li = liNode.cloneNode();
		// DirectoryEntry对象属性
    li.innerHTML = [
			'1文件名：', entry.name,
			'2相对沙盒根目录的全名称', entry.fullPath,
			'3是否是文件：', entry.isFile,
			'4是否是目录：', entry.isDirectory, 
			// 5.filesystem:当前fs（FileSystem对象）的引用
			entry.name.includes('.png')?
			//获取目录路径转换为URL地址，结果如：filesystem:http://localhost:57128/temporary/7.png
			'<img src="'+entry.toURL()+'"/>':
			''
		].join('');
    fragment.appendChild(li);
	});
  document.querySelector('#filelist').appendChild(fragment);
}

























function fileDemo(){
	//选择多个文件，并复制到沙盒文件系统中
	let files = document.querySelector('input').file;
	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		// File对象是文件系统中的文件数据对象，用于获取文件数据，含四属性
		// size: 文件数据对象的数据大小，单位为字节
		// type: 文件数据对象MIME类型
		// name: 文件数据对象的名称，不包括路径
		// lastModifiedDate: 文件对象的最后修改时间
		// file.slice(start, end)获取文件指定的数据内容
		// file.close()当文件数据对象不再使用时，可通过此方法关闭文件数据对象，释放系统资源
		(function (file) {
			// FileEntry.getFile( path, flag, succesCB, errorCB )创建或打开文件
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

	//移动文件,如果文件不存在移动失败
	fs.root.getFile('test.txt', { 
		create: false //如不指定create=true，文件不存在抛异常
	}, function (fileEntry) {
		//获取移动目录
		fs.root.getDirectory('mymove', { create: true }, function (dirEntry) {

			//移动文件
			fileEntry.moveTo(dirEntry, 'test_move.txt', function (fileEntry) {
				console.log('移动文件成功');
			}, errorHandler);

			//复制文件,如文件存在则覆盖
			fileEntry.copyTo(dirEntry, 'text_copy.txt', function (fileEntry) {
				console.info('复制文件成功,如文件存在则覆盖');
			}, errorHandler);

			fileEntry.remove(function (dirEntry) {
				console.log('删除文件成功');
			}, errorHandler);
		}, errorHandler);
	}, errorHandler);
}

function errorHandler(err) {
  console.error(err);
  //console.info(typeof FileError);//不可用或已经放弃
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


//具备filesystem: 网址，可用resolveLocalFileSystemURL找回fileEntry
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL ||window.webkitResolveLocalFileSystemURL;
var url = 'filesystem:http://localhost:57128/temporary/t.txt';
//获取fileEntry
window.resolveLocalFileSystemURL(url, function (fileEntry) {
	//读取文件内容
	showFile(fileEntry)
});

URLType 
// 文件路径类型
// 在文件系统中的文件路径需转换成URL格式，方便runtime快速加载

RelativeURL 
// 相对路径URL
// 只能在扩展API中使用，相对于基座提供的特定目录，以“_”开头。

// 常量：
"_www": 
// 应用资源目录
//保存应用的所有html、css、js等资源文件，与文件系统中根目录PRIVATE_WWW一致，后面加相对路径如“_www/res/icon.png”。 注意：应用资源目录是只读目录，只能读取次目录下的文件，不能修改或新建。

"_doc": 
// 应用私有文档目录
// 用于保存应用运行期业务逻辑数据，与文件系统中根目录PRIVATE_DOCUMENTS，如“_doc/userdata.xml”。

"_documents": 
// 程序公用文档目录
// 用于保存程序中各应用间可共享文件的目录，与文件系统中根目录PUBLIC_DOCUMENTS，如“_document/share.doc”。

"_downloads": 
// 程序公用下载目录
// 用于保存程序下载文件的目录，与文件系统中根目录PUBLIC_DOWNLOADS，如“_download/mydoc.doc”

LocalURL 
// 本地路径URL
// 可在html页面中直接访问本地资源，以“file:///”开头，后面跟随系统的绝对路径。如：“file:///D:/res/hello.html”。沙盒系统还有以‘filesystem:http://’开头

RemoteURL 
// 网络路径URL
// 可在html页面中以网络资源模式访问本地资源，以“http://”开头，后面跟随相对路径。 如示例：“http://localhost:13131/_www/res/icon.png”，其中“_www”字段可支持类型与相对路径URL一致。
