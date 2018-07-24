// JS是基于单线程环境的而 Web Workers （部分）可以突破这方面的限制
// Web Workers 允许你做诸如运行处理 CPU 计算密集型任务的耗时脚本而不会阻塞 UI 的事情。
// 事实上，所有这些操作都是并行执行的。
// Web Workers 是真正的多线程。
// Web Workers 并不是 JavaScript 的一部分，他们是可以通过 JavaScript 进行操作的浏览器功能之一。
// 以前，大多数的浏览器是单线程的（当然，现在已经变了），而且大多数的 JavaScript 功能是在浏览器端实现完成的。
// Node.js 没有实现 Web Workers －它有 『cluster』和 『child_process』的概念，这两者和 Web Workers 有些许差异。

// 规范中有三种类型的 Web Workers：
Dedicated Workers // 是由主进程实例化并且只能与之进行通信
Shared Workers // 可以被运行在同源的所有进程访问（不同的浏览的选项卡，内联框架及其它shared workers）
Service workers // 是一个由事件驱动的 worker，它由源和路径组成。它可以控制它关联的网页，解释且修改导航，资源的请求，以及一种非常细粒度的方式来缓存资源以让你非常灵活地控制程序在某些情况下的行为（比如网络不可用）






// Workers 使用类线程的消息传输－获取模式。它们非常适合于为用户提供最新的 UI ，高性能及流畅的体验。
// 文件存在且可访问，浏览器会生成一个隔离线程来异步加载。下载会被WebWorker完全隐藏
//当下载完成的时候，文件会立即执行然后 worker 开始运行。文件不存在worker运行失败且没任何提示
// 所执行的代码必须被包含在一个单独的文件之中
var worker = new Worker('doWork.js');
worker.addEventListener('message', function(e) {
	console.log(e.data);
}, false);
function startComputation() {
	// 有两种向 Web Workers 发送消息的方法：
	// 复制消息：消息被序列化，复制，然后发送出去，接着在接收端反序列化。页面和 worker 没有共享一个相同的消息实例，所以在每次传递消息过程中最后的结果都是复制的。大多数浏览器是通过在任何一端自动进行 JSON 编码/解码消息值来实现这一功能。正如所预料的那样，这些对于数据的操作显著增加了消息传送的性能开销。消息越大，传送的时间越长。
	// 消息传输：这意味着最初的消息发送者一发送即不再使用（）。数据传输非常的快。唯一的限制即只能传输 ArrayBuffer 数据对象。
	worker.postMessage({'cmd': 'average', 'data': [1, 2, 3, 4]});
}


// 在worker上下文中，self和this都指向worker的全局作用域
self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
		case 'average':
			// 由于 Web Workers 的多线程特性，只能使用一部分JS功能
			// navigator 对象
			// location 对象（只读）
			// XMLHttpRequest
			// set/clearTimeout() 和 set/clearInterval()
			// Application Cache
			// 使用 importScripts 来引用外部脚本
			// 创建其它 web workers
			// 不能够访问一些非常关键的JS功能：
			// DOM（非线程安全的）
			// window / document / parent 对象
      var result = method(data);
      self.postMessage(result);
      break;
    default:
			self.postMessage('Unknown command');
			// 有两种方法来中断 woker 的执行：主页面中调用 worker.terminate() 或者在 workder 内部调用 self.close()
			self.close()
  }
}, false);





// Broadcast Channel是更为普遍的通信接口。
//它允许我们向共享同一个源的所有上下文发送消息。
//同一个源下的所有的浏览器选项卡，内联框架或者 workers 都可以发送和接收消息：

// 连接到一个广播信道
var bc = new BroadcastChannel('test_channel');
// 发送简单信息示例
bc.postMessage('This is a test message.');
// 一个在控制台打印消息的简单事件处理程序示例
bc.onmessage = function (e) { 
  console.log(e.data); 
}
// 关闭信道
bc.close()