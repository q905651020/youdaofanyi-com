document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中 class 为 'downloadLink' 的所有元素
    const downloadLinks = document.querySelectorAll('.downloadLink');
    
    // 定义允许自动下载的文件扩展名数组
    const downloadExtensions = ['.apk', '.exe', '.zip', '.rar', '.gzip'];

    const isDownloadable = (url) => {
        // 获取 URL 中的文件扩展名，并转换为小写以确保匹配
        const ext = url.slice(url.lastIndexOf('.')).toLowerCase();
        // 检查该扩展名是否包含在允许下载的扩展名列表中
        return downloadExtensions.includes(ext);
    };

    const triggerDownload = (url) => {
        // 创建一个隐藏的 <a> 标签，用于触发下载
        const a = document.createElement('a');
        a.href = url;   // 设置链接的 href 属性为下载文件的 URL
        a.download = ''; // 设置 download 属性，确保浏览器下载文件而不是导航到该 URL

        // 将 <a> 标签添加到文档中
        document.body.appendChild(a);
        // 程序化地触发点击事件，启动下载
        a.click();
        // 下载完成后，移除该 <a> 标签，清理 DOM
        document.body.removeChild(a);
    };

    // 对所有匹配的元素添加点击事件监听器
    downloadLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault(); // 阻止默认的链接跳转行为

            // 获取 data-id 属性值，这个值通常用来标识要下载的资源
            const id = link.getAttribute('data-id');
            
            if (!id) {
                // 如果未找到 id 参数，则输出错误信息并终止操作
                console.error('未找到 id 参数');
                return;
            }

            try {
                // 发起 GET 请求，向服务器请求与该 id 相关的下载链接
                const response = await fetch(`/download/?id=${id}`);
                if (!response.ok) throw new Error('请求失败'); // 如果请求失败，抛出错误

                // 将响应解析为 JSON 格式
                const data = await response.json();
                const downloadUrl = data.download_url; // 从 JSON 响应中获取下载 URL

                // 判断是否为可下载文件类型
                if (isDownloadable(downloadUrl)) {
                    // 如果是可下载的文件类型，触发浏览器下载操作
                    triggerDownload(downloadUrl);
                } else {
                    // 如果不是可下载的文件类型，则在新窗口中打开该链接
                    window.open(downloadUrl, '_blank');
                }
            } catch (error) {
                // 捕获请求过程中出现的任何错误并输出到控制台
                console.error('请求出错:', error);
            }
        });
    });
});
