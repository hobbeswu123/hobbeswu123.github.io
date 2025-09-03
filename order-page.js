// 全局订单数据
let buyerOrders = [];
let sellerOrders = [];

// 初始化页面
function init() {
    // 清除本地存储中可能的旧数据
    localStorage.removeItem('orders');
    localStorage.removeItem('cartItems');
    
    // 生成购买订单数据
    buyerOrders = generateBuyerOrderData();
    
    // 生成卖家订单数据
    sellerOrders = generateSellerOrderData();
    
    // 渲染购买订单列表
    renderBuyerOrderList();
    
    // 更新订单总数
    updateTotalOrders();
    
    // 初始化选项卡切换
    initTabSwitching();
    
    // 初始化模态框事件
    initModalEvents();
    
    // 初始化购物车按钮事件
    initCartButton();
    
    // 初始化筛选功能
    initFilterFunctionality();
    
    // 显示提示信息
    showToast('欢迎来到订单中心！', 3000);
}

// 初始化选项卡切换
function initTabSwitching() {
    const buyerTab = document.getElementById('buyerTab');
    const sellerTab = document.getElementById('sellerTab');
    const buyerOrdersContainer = document.getElementById('buyerOrdersContainer');
    const sellerOrdersContainer = document.getElementById('sellerOrdersContainer');
    
    buyerTab.addEventListener('click', () => {
        // 激活购买订单选项卡
        buyerTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        buyerTab.classList.remove('text-gray-500');
        
        // 取消激活卖家订单选项卡
        sellerTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
        sellerTab.classList.add('text-gray-500');
        
        // 显示购买订单，隐藏卖家订单
        buyerOrdersContainer.classList.remove('hidden');
        sellerOrdersContainer.classList.add('hidden');
        
        // 更新订单总数
        updateTotalOrders();
    });
    
    sellerTab.addEventListener('click', () => {
        // 激活卖家订单选项卡
        sellerTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        sellerTab.classList.remove('text-gray-500');
        
        // 取消激活购买订单选项卡
        buyerTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
        buyerTab.classList.add('text-gray-500');
        
        // 显示卖家订单，隐藏购买订单
        sellerOrdersContainer.classList.remove('hidden');
        buyerOrdersContainer.classList.add('hidden');
        
        // 渲染卖家订单列表
        renderSellerOrderList();
        
        // 更新订单总数
        updateTotalOrders();
    });
}

// 初始化模态框事件
function initModalEvents() {
    const closeDetailModal = document.getElementById('closeDetailModal');
    const orderDetailModal = document.getElementById('orderDetailModal');
    
    if (closeDetailModal && orderDetailModal) {
        closeDetailModal.addEventListener('click', closeOrderDetailModal);
        
        // 点击模态框外部关闭
        orderDetailModal.addEventListener('click', (e) => {
            if (e.target === orderDetailModal) {
                closeOrderDetailModal();
            }
        });
    }
}

// 初始化购物车按钮
function initCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'nvidia-shop.html';
        });
    }
}

// 初始化筛选功能
function initFilterFunctionality() {
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => {
            const currentTab = document.getElementById('buyerTab').classList.contains('text-primary');
            if (currentTab) {
                renderBuyerOrderList();
            } else {
                renderSellerOrderList();
            }
        });
    }
}

// 生成购买订单数据
function generateBuyerOrderData() {
    const orders = [];
    
    // 生成20个已完成的订单
    for (let i = 0; i < 20; i++) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
        
        orders.push({
            id: 'ORD' + Date.now().toString().slice(-8) + i.toString().padStart(2, '0'),
            time: formatDate(orderDate),
            status: '已完成',
            items: [{
                id: 'RTX5090' + i,
                name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
                image: 'https://placehold.co/80x80/e2e8f0/475569?text=RTX+5090',
                price: 12999,
                quantity: 1
            }],
            total: 12999,
            address: {
                name: '张三',
                phone: '13800138000',
                address: '北京市海淀区中关村南大街5号 科技大厦 12层 1201室'
            }
        });
    }
    
    // 添加一个已出售状态的订单（作为示例）
    const sellDate = new Date();
    sellDate.setDate(sellDate.getDate() - 2);
    
    orders.push({
        id: 'ORD' + Date.now().toString().slice(-8) + '21',
        time: formatDate(sellDate),
        status: '已出售',
        items: [{
            id: 'RTX4080' + i,
            name: 'NVIDIA GeForce RTX 4080 16GB GDDR6X',
            image: 'https://placehold.co/80x80/e2e8f0/475569?text=RTX+4080',
            price: 8999,
            quantity: 1
        }],
        total: 8999,
        address: {
            name: '李四',
            phone: '13900139000',
            address: '上海市浦东新区张江高科技园区博云路2号 创新大厦 5层'
        }
    });
    
    // 按时间降序排序
    return orders.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// 生成卖家订单数据
function generateSellerOrderData() {
    const orders = [];
    
    // 显卡型号列表
    const gpuModels = [
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 4080 16GB GDDR6X',
        'NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X',
        'NVIDIA GeForce RTX 3090 Ti 24GB GDDR6X',
        'NVIDIA GeForce RTX 3080 10GB GDDR6X'
    ];
    
    // 显卡价格列表
    const gpuPrices = [12999, 8999, 6499, 9999, 5999];
    
    // 买家信息列表
    const buyerInfo = [
        { name: '王五', phone: '13700137000', address: '广州市天河区天河路385号 太古汇 23层' },
        { name: '赵六', phone: '13600136000', address: '深圳市南山区科技园南区高新南一道 飞亚达大厦 15层' },
        { name: '孙七', phone: '13500135000', address: '杭州市西湖区文三路90号 东部软件园 6号楼 8层' },
        { name: '周八', phone: '13400134000', address: '成都市锦江区春熙路299号 银石广场 21层' },
        { name: '吴九', phone: '13300133000', address: '武汉市江汉区解放大道690号 武汉国际广场 18层' }
    ];
    
    // 订单状态列表
    const statuses = ['待付款', '待发货', '待收货', '已完成', '已出售'];
    
    // 生成15个卖家订单
    for (let i = 0; i < 15; i++) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 60));
        
        const modelIndex = Math.floor(Math.random() * gpuModels.length);
        const buyerIndex = Math.floor(Math.random() * buyerInfo.length);
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3个
        
        const price = gpuPrices[modelIndex];
        const total = price * quantity;
        
        orders.push({
            id: 'SEL' + Date.now().toString().slice(-8) + i.toString().padStart(2, '0'),
            time: formatDate(orderDate),
            status: statuses[statusIndex],
            item: {
                id: 'GPU' + i,
                name: gpuModels[modelIndex],
                image: `https://placehold.co/80x80/e2e8f0/475569?text=${gpuModels[modelIndex].split(' ')[2]}`,
                price: price,
                quantity: quantity
            },
            total: total,
            buyer: buyerInfo[buyerIndex]
        });
    }
    
    // 按时间降序排序
    return orders.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// 渲染购买订单列表
function renderBuyerOrderList() {
    const orderList = document.getElementById('buyerOrderList');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    
    if (!orderList) return;
    
    // 获取筛选状态
    const filterStatus = orderStatusFilter ? orderStatusFilter.value : '全部订单';
    
    // 根据筛选条件过滤订单
    let filteredOrders = buyerOrders;
    if (filterStatus !== '全部订单') {
        filteredOrders = buyerOrders.filter(order => order.status === filterStatus);
    }
    
    // 清空订单列表
    orderList.innerHTML = '';
    
    // 如果没有订单，显示空状态
    if (filteredOrders.length === 0) {
        orderList.innerHTML = `
            <tr>
                <td colspan="7" class="py-10 text-center text-gray-500">
                    <i class="fa fa-shopping-bag text-4xl mb-3"></i>
                    <p>暂无订单记录</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // 渲染订单列表
    filteredOrders.forEach(order => {
        const orderRow = document.createElement('tr');
        orderRow.className = 'border-t border-gray-200 table-hover';
        
        // 获取订单状态徽章
        const statusBadge = getStatusBadge(order.status);
        
        // 构建订单商品信息
        const orderItems = order.items.map(item => `
            <div class="flex items-center space-x-3">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                <div class="text-left">
                    <p class="font-medium">${item.name}</p>
                    <p class="text-gray-500 text-xs">数量: ${item.quantity}</p>
                </div>
            </div>
        `).join('');
        
        // 构建操作按钮
        const actionButtons = getActionButtons(order.status);
        
        // 设置订单行HTML
        orderRow.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <input type="checkbox" class="form-checkbox text-primary h-4 w-4 rounded">
                </div>
            </td>
            <td class="py-4 px-6">${order.id}</td>
            <td class="py-4 px-6">${orderItems}</td>
            <td class="py-4 px-6 font-medium">¥${order.total.toLocaleString()}</td>
            <td class="py-4 px-6">${order.time}</td>
            <td class="py-4 px-6">${statusBadge}</td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button class="btn-outline py-1 px-3 text-xs" data-order-id="${order.id}" onclick="openOrderDetailModal('${order.id}', 'buyer')">查看详情</button>
                    ${actionButtons}
                </div>
            </td>
        `;
        
        // 添加订单行到列表
        orderList.appendChild(orderRow);
    });
}

// 渲染卖家订单列表
function renderSellerOrderList() {
    const orderList = document.getElementById('sellerOrderList');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    
    if (!orderList) return;
    
    // 获取筛选状态
    const filterStatus = orderStatusFilter ? orderStatusFilter.value : '全部订单';
    
    // 根据筛选条件过滤订单
    let filteredOrders = sellerOrders;
    if (filterStatus !== '全部订单') {
        filteredOrders = sellerOrders.filter(order => order.status === filterStatus);
    }
    
    // 清空订单列表
    orderList.innerHTML = '';
    
    // 如果没有订单，显示空状态
    if (filteredOrders.length === 0) {
        orderList.innerHTML = `
            <tr>
                <td colspan="8" class="py-10 text-center text-gray-500">
                    <i class="fa fa-store text-4xl mb-3"></i>
                    <p>暂无售卖订单记录</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // 渲染订单列表
    filteredOrders.forEach(order => {
        const orderRow = document.createElement('tr');
        orderRow.className = 'border-t border-gray-200 table-hover';
        
        // 获取订单状态徽章
        const statusBadge = getStatusBadge(order.status);
        
        // 构建卖家操作按钮
        const actionButtons = getSellerActionButtons(order.status);
        
        // 设置订单行HTML
        orderRow.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <input type="checkbox" class="form-checkbox text-primary h-4 w-4 rounded">
                </div>
            </td>
            <td class="py-4 px-6">${order.id}</td>
            <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                    <img src="${order.item.image}" alt="${order.item.name}" class="w-12 h-12 object-cover rounded">
                    <div class="text-left">
                        <p class="font-medium">${order.item.name}</p>
                        <p class="text-gray-500 text-xs">数量: ${order.item.quantity}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6">
                <div>
                    <p class="font-medium">${order.buyer.name}</p>
                    <p class="text-gray-500 text-xs">${order.buyer.phone}</p>
                </div>
            </td>
            <td class="py-4 px-6 font-medium">¥${order.total.toLocaleString()}</td>
            <td class="py-4 px-6">${order.time}</td>
            <td class="py-4 px-6">${statusBadge}</td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button class="btn-outline py-1 px-3 text-xs" data-order-id="${order.id}" onclick="openOrderDetailModal('${order.id}', 'seller')">查看详情</button>
                    ${actionButtons}
                </div>
            </td>
        `;
        
        // 添加订单行到列表
        orderList.appendChild(orderRow);
    });
}

// 获取订单状态徽章
function getStatusBadge(status) {
    switch (status) {
        case '待付款':
            return '<span class="badge-status bg-yellow-100 text-yellow-800">待付款</span>';
        case '待发货':
            return '<span class="badge-status bg-blue-100 text-blue-800">待发货</span>';
        case '待收货':
            return '<span class="badge-status bg-purple-100 text-purple-800">待收货</span>';
        case '已完成':
            return '<span class="badge-status bg-green-100 text-green-800">已完成</span>';
        case '已取消':
            return '<span class="badge-status bg-gray-100 text-gray-800">已取消</span>';
        case '已出售':
            return '<span class="badge-status bg-accent/10 text-accent">已出售</span>';
        default:
            return '<span class="badge-status bg-gray-100 text-gray-800">未知状态</span>';
    }
}

// 获取购买订单操作按钮
function getActionButtons(status) {
    switch (status) {
        case '待付款':
            return '<button class="btn-primary py-1 px-3 text-xs">去付款</button>';
        case '待发货':
            return '<button class="btn-outline py-1 px-3 text-xs">提醒发货</button>';
        case '待收货':
            return '<button class="btn-primary py-1 px-3 text-xs">确认收货</button>';
        case '已完成':
            return '<button class="btn-outline py-1 px-3 text-xs">再次购买</button>';
        case '已取消':
            return '<button class="btn-outline py-1 px-3 text-xs">删除订单</button>';
        default:
            return '';
    }
}

// 获取卖家订单操作按钮
function getSellerActionButtons(status) {
    switch (status) {
        case '待付款':
            return '<button class="btn-outline py-1 px-3 text-xs">联系买家</button>';
        case '待发货':
            return '<button class="btn-primary py-1 px-3 text-xs">去发货</button>';
        case '待收货':
            return '<button class="btn-outline py-1 px-3 text-xs">提醒收货</button>';
        case '已完成':
        case '已出售':
            return '<button class="btn-outline py-1 px-3 text-xs">评价管理</button>';
        default:
            return '';
    }
}

// 打开订单详情模态框
function openOrderDetailModal(orderId, type = 'buyer') {
    const orderDetailModal = document.getElementById('orderDetailModal');
    const detailOrderId = document.getElementById('detailOrderId');
    const detailOrderTime = document.getElementById('detailOrderTime');
    const detailOrderStatus = document.getElementById('detailOrderStatus');
    const detailOrderItems = document.getElementById('detailOrderItems');
    const detailSubtotal = document.getElementById('detailSubtotal');
    const detailTotal = document.getElementById('detailTotal');
    
    if (!orderDetailModal || !detailOrderId || !detailOrderTime || !detailOrderStatus || !detailOrderItems || !detailSubtotal || !detailTotal) {
        return;
    }
    
    // 查找订单
    let order;
    if (type === 'buyer') {
        order = buyerOrders.find(o => o.id === orderId);
    } else {
        order = sellerOrders.find(o => o.id === orderId);
    }
    
    if (!order) {
        showToast('订单不存在', 2000);
        return;
    }
    
    // 设置订单基本信息
    detailOrderId.textContent = order.id;
    detailOrderTime.textContent = order.time;
    
    // 设置订单状态
    detailOrderStatus.textContent = order.status;
    
    // 根据状态设置颜色
    switch (order.status) {
        case '待付款':
            detailOrderStatus.className = 'font-medium text-yellow-500';
            break;
        case '待发货':
            detailOrderStatus.className = 'font-medium text-blue-500';
            break;
        case '待收货':
            detailOrderStatus.className = 'font-medium text-purple-500';
            break;
        case '已完成':
            detailOrderStatus.className = 'font-medium text-green-500';
            break;
        case '已取消':
            detailOrderStatus.className = 'font-medium text-gray-500';
            break;
        case '已出售':
            detailOrderStatus.className = 'font-medium text-accent';
            break;
        default:
            detailOrderStatus.className = 'font-medium text-gray-500';
    }
    
    // 清空商品列表
    detailOrderItems.innerHTML = '';
    
    // 设置商品列表
    if (type === 'buyer') {
        order.items.forEach(item => {
            const itemRow = document.createElement('tr');
            itemRow.className = 'border-t border-gray-200';
            itemRow.innerHTML = `
                <td class="py-3 px-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="py-3 px-4">${item.name}</td>
                <td class="py-3 px-4">¥${item.price.toLocaleString()}</td>
                <td class="py-3 px-4">${item.quantity}</td>
                <td class="py-3 px-4 font-medium">¥${(item.price * item.quantity).toLocaleString()}</td>
            `;
            detailOrderItems.appendChild(itemRow);
        });
    } else {
        // 卖家订单
        const item = order.item;
        const itemRow = document.createElement('tr');
        itemRow.className = 'border-t border-gray-200';
        itemRow.innerHTML = `
            <td class="py-3 px-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="py-3 px-4">${item.name}</td>
            <td class="py-3 px-4">¥${item.price.toLocaleString()}</td>
            <td class="py-3 px-4">${item.quantity}</td>
            <td class="py-3 px-4 font-medium">¥${(item.price * item.quantity).toLocaleString()}</td>
        `;
        detailOrderItems.appendChild(itemRow);
    }
    
    // 设置金额信息
    detailSubtotal.textContent = `¥${order.total.toLocaleString()}`;
    detailTotal.textContent = `¥${order.total.toLocaleString()}`;
    
    // 显示模态框
    orderDetailModal.classList.remove('hidden');
}

// 关闭订单详情模态框
function closeOrderDetailModal() {
    const orderDetailModal = document.getElementById('orderDetailModal');
    if (orderDetailModal) {
        orderDetailModal.classList.add('hidden');
    }
}

// 更新订单总数
function updateTotalOrders() {
    const totalOrders = document.getElementById('totalOrders');
    if (!totalOrders) return;
    
    const currentTab = document.getElementById('buyerTab').classList.contains('text-primary');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const filterStatus = orderStatusFilter ? orderStatusFilter.value : '全部订单';
    
    let count = 0;
    if (currentTab) {
        count = filterStatus === '全部订单' ? buyerOrders.length : buyerOrders.filter(order => order.status === filterStatus).length;
    } else {
        count = filterStatus === '全部订单' ? sellerOrders.length : sellerOrders.filter(order => order.status === filterStatus).length;
    }
    
    totalOrders.textContent = count;
}

// 显示提示信息
function showToast(message, duration = 2000) {
    // 检查是否已存在toast元素
    let toast = document.getElementById('toast-message');
    
    // 如果不存在，创建新的toast元素
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300';
        document.body.appendChild(toast);
    }
    
    // 设置toast消息
    toast.textContent = message;
    
    // 显示toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 隐藏toast
    setTimeout(() => {
        toast.style.opacity = '0';
    }, duration - 300);
    
    // 移除toast元素
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, duration);
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);