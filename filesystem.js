//请求系统配额类型
window.TEMPORARY//0  临时
window.PERSISTENT//1  持久

//当前请求存储空间，如不修改大小，只需要请求一次
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

//持久存储要用StorageInfo.requestQuota，成功回调参数为请求成功的空间
window.webkitStorageInfo.requestQuota(window.PERSISTENT,1024*1024*5,function(gratedBytes) {
  window.requestFileSystem(window.PERSISTENT, gratedBytes, initFs, errorHandler);
}, errorHandler);

//出错回调
function errorHandler(err) {
  console.error(err);
  //console.info(typeof FileError);//不可用或已经放弃
}