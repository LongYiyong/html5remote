// FileAPI，是一些列文件处理规范的基础，包含最基础的文件操作的JS接口设计
// 文件操作API：

FileList 
// 代表一组文件的JS对象，比如通过input[type="file"]元素选中的本地文件列表
filelist[index] // 得到第index个文件 

Blob
// 代表一段二进制数据，且允许通过JS对其数据以字节为单位进行“切割”，关于Blob对象
blob.size // 只读特性，数据的字节数  
blob.type // 对象的MIME类型，若是未知类型返回空字符串
blob.slice(start,length) // 将当前文件切割并将结果返回,可以通过这个方法访问到字节内部的原始数据块

File
// 代表一个文件，是从Blob接口继承而来的，并在此基础上增加了诸如文件名、MIME类型之类的特性，关于File对象 
file.size // 继承自Blob，意义同上  
file.slice(start, length) // 继承自Blob，意义同上  
file.name // 只读属性，文件名  
file.type // 只读属性，文件的MIME类型  
file.lastModifiedDate // 只读属性，最后文件修改时间

FileReader
// 属性
reader.result //读取的结果(二进制、文本或DataURL格式)  
reader.readyState //读取操作的状态(EMPTY、LOADING、DONE) 
// 方法
reader.readAsArrayBuffer(blob/file) //将读取结果封装成ArrayBuffer，如果想使用一般需要转换成Int8Array或DataView
reader.readAsBinaryString(blob/file) // 以二进制格式读取文件内容  
reader.readAsText(file, [encoding]) //以文本(及字符串)格式读取文件内容，并且可以强制选择文件编码 
reader.readAsDataURL(file) //以DataURL格式读取文件内容  
reader.abort() // 终止读取操作 
// 事件
reader.onloadstart // 读取操作开始时触发  
reader.onload // 读取操作成功时触发  
reader.onloadend // 读取操作完成时触发
reader.onprogress//读取过程中触发实时监控读取进度
reader.onabort // 读取操作被中断时触发  
reader.onerror // 读取操作失败时触发 


FileWriter
//

// Blob接口和File接口可以返回数据的字节数等信息，也可以“切割”，但无法获取真正的内容，这也正是FileReader存在的意义，而文件大小不一时，读取文件可能存在明显的时间花费，所以我们用异步的方式，通过触发另外的事件来返回读取到的文件内容








//举例一：控制file控件，读取其中的第二个文件，并将其文本内容在控制台输出
<input id="fileBox" type="file" multiple accept="image/*" />
// accept属性控制允许上传的文件类型。该属性为一个或多个MIME类型字符串。多个MIME类型字符串之间应以逗号分割。这种文件类型过滤是很脆弱的，如果开发者需要进行文件上传，则必须在服务器端对文件类型进行过滤。

var input = document.querySelector('input[type="file"]');
var secondFile = input.files[1];

var reader = new FileReader();
reader.readAsText(secondFile);
reader.onloadend = function (e) {
  console.log(reader.result);
}; 

//举例二：给一个含utf-8编码的文本文件file去掉BOM头信息
var size = file.size; // 先取得文件总字节数  
var result = file.slice(3,size-3);//去掉开头3个字节 


//默认FileReader会分段读取File对象，这是分段大小不一定，并且一般会很大
fileBox.onchange = function () {
  var file = this.files[0];
  var reader = new FileReader();
  //var step = 10 * 3 * 8; //固定长度截取 文件内容时注意，在切分点会有乱码出现的可能
  var step = 1024 * 512; //如果文件太大，截取内容小会出现假死现象，因为js执行是同步的
  var total = file.size;
  var cuLoaded = 0;
  reader.onload = function (e) {//读取一段成功
    uploadFile(reader.result, cuLoaded, function(){
      showResult(reader.result);
      cuLoaded += loaded;
      if (cuLoaded < total) {
        //IE 浏览器下，事件触发速度太快，页面容易出现假死现象，解决方案延缓事件触发
        setTimeout(function () {
          readBlob(cuLoaded);
        }, 10);
        //直接使用在Google，FF没问题
        // readBlob(cuLoaded);
      } else {
        console.log('总共用时：' + (new Date().getTime() - startTime.getTime()) / 1000);
        cuLoaded = total;
      }
    });
  }
  reader.onprogress = function (e) {
    if (e.lengthComputable == false)
      return;
    cuLoaded += e.loaded;
    //更新进度条
    var value = (_this.loaded / _this.total) * 100;
  }
  //处理显示读取结果
  function showResult(result) {
    //在读取结果处理中，如果没有Dom显示操作，速度还是非常快的,如果有Dom显示操作在IE下，很容易使浏览器崩溃
    $('blockquote').append(result);

    // var buf = new Uint8Array(result);ArrayBuffer
    // $('blockquote').append(buf.toString());
  }
  // var reader2 = new FileReader();
  // function showResult(result) {
  //   //解决方案 先读取 blob 然后在转换成 字符串
  //   //如用Uint8Array 则每次读取数量应该是8的倍数
  //   var buf = new Uint8Array(result);Int32Array
  //   var blob = new Blob([buf]);
  //   reader2.readAsText(blob, 'gbk');
  //   reader2.onload = function (e) {
  //     $('blockquote').append(reader2.result);
  //   }
  // }
  //开始读取
  readBlob(0);
  //指定开始位置，分块读取文件
  function readBlob(start) {
    var blob = file.slice(start, start + step);
    reader.readAsText(blob, 'gbk');

    // reader.readAsArrayBuffer(blob);
  }
  //使用Ajax方式上传，文件不能过大，最好小于三四百兆，因为过多的连续Ajax请求会使后台崩溃，获取InputStream中数据会为空，尤其在Google浏览器测试过程中。
  function uploadFile(result, startIndex, onSuccess) {
    var blob = new Blob([result]);
    //提交到服务器
    var fd = new FormData();
    fd.append('file', blob);
    fd.append('filename', file.name);
    fd.append('loaded', startIndex);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '../ashx/upload2.ashx', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.info(xhr.responseText);
        onSuccess();
      } else if (xhr.status == 500) {
        //console.info('请求出错，' + xhr.responseText);
        setTimeout(function () {
          readBlob(cuLoaded);
        }, 1000);
      }
    }
    xhr.send(fd);
  }
}




