// 全局订单数据
let buyerOrders = [];
let sellerOrders = [];

// 初始化页面
function init() {
    // 尝试从本地存储加载订单数据
    const savedOrders = localStorage.getItem('orders');
    
    if (savedOrders) {
        // 如果有保存的数据，则使用保存的数据
        try {
            const parsedOrders = JSON.parse(savedOrders);
            buyerOrders = parsedOrders.buyerOrders || [];
            sellerOrders = parsedOrders.sellerOrders || [];
        } catch (e) {
            // 如果解析失败，则生成新数据
            buyerOrders = generateBuyerOrderData();
            sellerOrders = generateSellerOrderData();
        }
    } else {
        // 如果没有保存的数据，则生成新数据
        buyerOrders = generateBuyerOrderData();
        sellerOrders = generateSellerOrderData();
    }
    
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
    
    // 初始化增加订单按钮事件
    initAddOrderButtons();
    
    // 计算并显示订单统计信息
    calculateOrderStats();
    
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
    
    // 订单状态设置为仅'已完成'
    const status = '已完成';
    
    // 添加特定的RTX 5090订单 - 2025-03-05，数量4张，每张24250元
    const order1Date = new Date(2025, 2, 5, 10, 30, 0); // 2025-03-05 10:30:00
    orders.push({
        id: 'ORD' + Date.now().toString().slice(-8) + '01',
        time: formatDate(order1Date),
        status: status,
        items: [
            {
                id: 'RTX5090' + '01',
                name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
                image: 'images/rtx5090.png',
                price: 24250,
                quantity: 4
            }
        ],
        total: 24250 * 4, // 总价97000元
        address: {
            name: '吴*斌',
            phone: '15759890802',
            address: '福建省泉州市丰泽区万科二期102室'
        }
    });
    
    // 添加特定的RTX 5090订单 - 2025-03-10，数量4张，每张26000元
    const order2Date = new Date(2025, 2, 10, 14, 15, 0); // 2025-03-10 14:15:00
    orders.push({
        id: 'ORD' + Date.now().toString().slice(-8) + '02',
        time: formatDate(order2Date),
        status: status,
        items: [
            {
                id: 'RTX5090' + '02',
                name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
                image: 'images/rtx5090.png',
                price: 26000,
                quantity: 4
            }
        ],
        total: 26000 * 4, // 总价104000元
        address: {
            name: '吴*斌',
            phone: '15759890802',
            address: '福建省泉州市丰泽区万科二期102室'
        }
    });
    
    // 单独指定的订单日期数组 - 方便随时更改
    const orderDates = [
        new Date(2025, 1, 13, 9, 0, 0),  // 2025-02-13 09:00:00
        new Date(2025, 1, 13, 9, 0, 0),  // 2025-02-25 09:00:00
        new Date(2025, 1, 28, 15, 30, 0), // 2025-02-28 15:30:00
        new Date(2025, 2, 1, 11, 15, 0),  // 2025-03-01 11:15:00
        new Date(2025, 2, 3, 16, 45, 0),  // 2025-03-03 16:45:00
        new Date(2025, 2, 8, 10, 0, 0),   // 2025-03-08 10:00:00
        new Date(2025, 2, 12, 14, 20, 0), // 2025-03-12 14:20:00
        new Date(2025, 2, 15, 16, 10, 0), // 2025-03-15 16:10:00
        new Date(2025, 2, 18, 9, 30, 0),  // 2025-03-18 09:30:00
        new Date(2025, 2, 22, 15, 50, 0), // 2025-03-22 15:50:00
        new Date(2025, 2, 25, 11, 25, 0), // 2025-03-25 11:25:00
        new Date(2025, 2, 28, 16, 35, 0), // 2025-03-28 16:35:00
        new Date(2025, 3, 2, 10, 5, 0),   // 2025-04-02 10:05:00
        new Date(2025, 3, 5, 14, 40, 0),  // 2025-04-05 14:40:00
        new Date(2025, 3, 8, 16, 55, 0),  // 2025-04-08 16:55:00
        new Date(2025, 3, 12, 9, 45, 0),  // 2025-04-12 09:45:00
        new Date(2025, 3, 15, 15, 25, 0), // 2025-04-15 15:25:00
        new Date(2025, 3, 18, 11, 10, 0), // 2025-04-18 11:10:00
        new Date(2025, 3, 22, 16, 20, 0)  // 2025-04-22 16:20:00
    ];
    
    // 单独指定的显卡型号数组 - 方便随时更改
    const gpuModels = [
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 4090 24GB GDDR6X',
        'NVIDIA GeForce RTX 5090 24GB GDDR7',
        'NVIDIA GeForce RTX 5090 24GB GDDR6X'
    ];
    
    // 单独指定的价格数组 - 方便随时更改
    const gpuPrices = [
        20999, 20999, 9999, 13500, 10500, 14000, 11000, 14500, 11500,
        15000, 12000, 15500, 12500, 16000, 13000, 16500, 13500,
        17000, 14000
    ];
    
    // 单独指定的数量数组 - 方便随时更改
    const quantities = [
        1, 1, 2, 1, 3, 2, 1, 3, 2,
        1, 3, 2, 1, 3, 2, 1, 3,
        2, 1
    ];
    
    // 根据单独指定的数组生成订单（总共18个，加上前面2个特定订单，共20个）
    for (let i = 0; i < orderDates.length; i++) {
        const orderDate = orderDates[i];
        const model = gpuModels[i];
        const price = gpuPrices[i];
        const quantity = quantities[i];
        const orderIndex = i + 3; // 从3开始，因为前面已经有2个订单了
        
        orders.push({
            id: 'ORD' + (Date.now() + orderIndex).toString().slice(-8) + orderIndex.toString().padStart(2, '0'),
            time: formatDate(orderDate),
            status: status,
            items: [
                {
                    id: model.split(' ')[2] + orderIndex,
                    name: model,
                    image: model.includes('4090') ? 'images/rtx4090.png' : 'images/rtx5090.png',
                    price: price,
                    quantity: quantity
                }
            ],
            total: price * quantity,
            address: {
                name: '吴*斌',
                phone: '15759890802',
                address: '福建省泉州市丰泽区万科二期102室'
            }
        });
    }
    
    // 自定义排序逻辑：让ORD1445614005排在ORD1445615014上面，其他订单按时间降序排序
    return orders.sort((a, b) => {
        // 特殊处理这两个订单
        if (a.id === 'ORD1445614005' && b.id === 'ORD1445615014') {
            return -1; // a排在b前面
        }
        if (a.id === 'ORD1445615014' && b.id === 'ORD1445614005') {
            return 1; // b排在a前面
        }
        // 其他订单按时间降序排序
        return new Date(b.time) - new Date(a.time);
    });
}

// 生成卖家订单数据 - 修改为与购买订单对应，并确保总亏损在15万左右
function generateSellerOrderData() {
    const orders = [];
    
    // 显卡成本价列表（成本价高于售价，以实现亏损）
    const gpuCostPrices = {
        'NVIDIA GeForce RTX 5090 24GB GDDR7': 28000,  // 成本价
        'NVIDIA GeForce RTX 4090 24GB GDDR6X': 15000  // 成本价
    };
    
    // 买家信息列表
    const buyerInfo = [
        { name: '星辰大海', phone: '158*****678', address: '北京市海淀区中关村大街1号 创新大厦 12层' },
        { name: 'John Smith', phone: '139*****321', address: '上海市浦东新区陆家嘴金融中心 环球金融中心 35层' },
        { name: '风行者', phone: '187*****222', address: '广州市天河区天河路385号 太古汇 23层' },
        { name: 'Sarah Chen', phone: '186*****444', address: '深圳市南山区科技园南区高新南一道 飞亚达大厦 15层' },
        { name: '孤独的程序员', phone: '175*****666', address: '杭州市西湖区文三路90号 东部软件园 6号楼 8层' }
    ];
    
    // 买家索引数组，用于从buyerInfo中选择特定的买家（可单独修改）
    const buyerIndices = [0, 2, 1, 3, 4, 0, 2, 1, 3, 4];
    
    // 添加特定的RTX 5090订单 - 2025-03-05 15:34:12，数量1张，单价23999元
    const sellerOrder0Date = new Date(2025, 2, 5, 15, 34, 12); // 2025-03-05 15:34:12
    const costPrice0 = gpuCostPrices['NVIDIA GeForce RTX 5090 24GB GDDR7'];
    orders.push({
        id: 'SEL' + Date.now().toString().slice(-8) + '00',
        time: formatDate(sellerOrder0Date),
        status: '已出售',
        item: {
            id: 'RTX5090_SELL00',
            name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
            image: 'images/rtx5090.png',
            price: 23999,  // 售价23999元
            costPrice: costPrice0,  // 成本价
            quantity: 1
        },
        total: 23999 * 1,  // 销售总价
        costTotal: costPrice0 * 1,  // 成本总价
        profit: (23999 - costPrice0) * 1,  // 利润（亏损为负）
        buyer: buyerInfo[buyerIndices[0]] // 使用配置的买家索引
    });
    
    // 先添加与两个特定购买订单对应的卖家订单
    // 对应购买订单1: RTX 5090，4张，单价24250元
    const sellerOrder1Date = new Date(2025, 2, 5, 10, 30, 0); // 与购买订单相同时间
    const costPrice1 = gpuCostPrices['NVIDIA GeForce RTX 5090 24GB GDDR7'];
    orders.push({
        id: 'SEL' + Date.now().toString().slice(-8) + '01',
        time: formatDate(sellerOrder1Date),
        status: '已出售',
        item: {
            id: 'RTX5090_SELL01',
            name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
            image: 'images/rtx5090.png',
            price: 24250,  // 售价（与购买价格相同）
            costPrice: costPrice1,  // 成本价
            quantity: 4
        },
        total: 24250 * 4,  // 销售总价
        costTotal: costPrice1 * 4,  // 成本总价
        profit: (24250 - costPrice1) * 4,  // 利润（亏损为负）
        buyer: buyerInfo[buyerIndices[1]] // 使用配置的买家索引
    });
    
    // 对应购买订单2: RTX 5090，4张，单价26000元
    const sellerOrder2Date = new Date(2025, 2, 10, 14, 15, 0); // 与购买订单相同时间
    const costPrice2 = gpuCostPrices['NVIDIA GeForce RTX 5090 24GB GDDR7'];
    orders.push({
        id: 'SEL' + Date.now().toString().slice(-8) + '02',
        time: formatDate(sellerOrder2Date),
        status: '已出售',
        item: {
            id: 'RTX5090_SELL02',
            name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
            image: 'images/rtx5090.png',
            price: 26000,  // 售价（与购买价格相同）
            costPrice: costPrice2,  // 成本价
            quantity: 4
        },
        total: 26000 * 4,  // 销售总价
        costTotal: costPrice2 * 4,  // 成本总价
        profit: (26000 - costPrice2) * 4,  // 利润（亏损为负）
        buyer: buyerInfo[buyerIndices[1]] // 使用配置的买家索引
    });
    
    // 为剩余的购买订单生成对应的卖家订单
    // 从buyerOrders中获取剩余订单（跳过前两个特定订单）
    for (let i = 2; i < buyerOrders.length; i++) {
        const buyerOrder = buyerOrders[i];
        const item = buyerOrder.items[0]; // 假设每个订单只有一个商品
        
        // 查找对应的成本价
        const costPrice = gpuCostPrices[item.name];
        
        // 创建对应的卖家订单
        orders.push({
            id: 'SEL' + (Date.now() + i).toString().slice(-8) + i.toString().padStart(2, '0'),
            time: buyerOrder.time,  // 与购买订单相同时间
            status: '已出售',
            item: {
                id: item.id + '_SELL',
                name: item.name,
                image: item.image,
                price: item.price,  // 售价（与购买价格相同）
                costPrice: costPrice,  // 成本价
                quantity: item.quantity
            },
            total: item.price * item.quantity,  // 销售总价
            costTotal: costPrice * item.quantity,  // 成本总价
            profit: (item.price - costPrice) * item.quantity,  // 利润（亏损为负）
            buyer: buyerInfo[buyerIndices[i]] // 使用配置的买家索引
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
                    <p class="font-medium">${order.buyer ? order.buyer.name : '未知买家'}</p>
                    <p class="text-gray-500 text-xs">${order.buyer ? order.buyer.phone : '未知电话'}</p>
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
    // 为所有订单添加编辑按钮 - 不使用内联onclick，而是添加类名和数据属性
    let editButton = '<button class="btn-outline py-1 px-3 text-xs bg-orange-50 text-orange-600 edit-order-btn" data-order-type="buyer">数据</button>';
    
    // 为所有订单添加删除按钮
    let deleteButton = '<button class="btn-outline py-1 px-3 text-xs bg-red-50 text-red-600 delete-order-btn" data-order-type="buyer">删除订单</button>';
    
    let statusButtons = '';
    switch (status) {
        case '待付款':
            statusButtons = '<button class="btn-primary py-1 px-3 text-xs">去付款</button>';
            break;
        case '待发货':
            statusButtons = '<button class="btn-outline py-1 px-3 text-xs">提醒发货</button>';
            break;
        case '待收货':
            statusButtons = '<button class="btn-primary py-1 px-3 text-xs">确认收货</button>';
            break;
        case '已完成':
            statusButtons = '<button class="btn-outline py-1 px-3 text-xs">再次购买</button>';
            break;
        default:
            statusButtons = '';
    }
    
    // 将数据按钮设置为长按才能激活，删除订单按钮默认显示
    return `<button class="btn-outline py-1 px-3 text-xs bg-blue-50 text-blue-600 view-actions-btn">查看操作</button>
            <div class="action-buttons hidden">
                <div class="edit-section">${editButton}</div>
                <div class="delete-section">${deleteButton}</div>
            </div> ${statusButtons ? ' ' + statusButtons : ''}`;
}

// 获取卖家订单操作按钮
function getSellerActionButtons(status) {
    // 为所有订单添加编辑按钮 - 不使用内联onclick，而是添加类名和数据属性
    let editButton = '<button class="btn-outline py-1 px-3 text-xs bg-orange-50 text-orange-600 edit-order-btn" data-order-type="seller">数据</button>';
    
    // 为所有订单添加删除按钮
    let deleteButton = '<button class="btn-outline py-1 px-3 text-xs bg-red-50 text-red-600 delete-order-btn" data-order-type="seller">删除订单</button>';
    
    let statusButtons = '';
    switch (status) {
        case '待付款':
            statusButtons = '<button class="btn-outline py-1 px-3 text-xs">联系买家</button>';
            break;
        case '待发货':
            statusButtons = '<button class="btn-primary py-1 px-3 text-xs">去发货</button>';
            break;
        case '待收货':
            statusButtons = '<button class="btn-outline py-1 px-3 text-xs">提醒收货</button>';
            break;
        case '已完成':
        case '已出售':
            statusButtons = '<button class="btn-outline py-1 px-3 text-xs">评价管理</button>';
            break;
        default:
            statusButtons = '';
    }
    
    // 将数据按钮设置为长按才能激活，删除订单按钮默认显示
    return `<button class="btn-outline py-1 px-3 text-xs bg-blue-50 text-blue-600 view-actions-btn">查看操作</button>
            <div class="action-buttons hidden">
                <div class="edit-section">${editButton}</div>
                <div class="delete-section">${deleteButton}</div>
            </div> ${statusButtons ? ' ' + statusButtons : ''}`;
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
    
    // 获取地址信息部分元素
    const addressSection = document.querySelector('#orderDetailModal h4.font-bold').closest('div.mb-8');
    const addressTitle = addressSection ? addressSection.querySelector('h4') : null;
    const addressContent = addressSection ? addressSection.querySelector('div.border.p-4.rounded-lg') : null;
    
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
    
    // 根据类型更新地址信息标题
    if (addressTitle && addressContent) {
        if (type === 'seller') {
            // 售卖订单显示为发货地址
            addressTitle.textContent = '发货地址';
            
            // 优先使用订单中的买家信息
            if (order.buyer && order.buyer.name && order.buyer.phone && order.buyer.address) {
                addressContent.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center">
                            <span class="font-medium mr-3">${order.buyer.name}</span>
                            <span>${order.buyer.phone}</span>
                        </div>
                    </div>
                    <p>${order.buyer.address}</p>
                `;
            } else {
                // 如果订单中没有买家信息，使用默认地址
                addressContent.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center">
                            <span class="font-medium mr-3">张*明</span>
                            <span>13912345678</span>
                        </div>
                    </div>
                    <p>上海市浦东新区张江高科技园区博云路2号</p>
                `;
            }
        } else {
            // 购买订单显示为收货信息
            addressTitle.textContent = '收货信息';
            
            // 优先使用订单中的地址信息
            if (order.address && order.address.name && order.address.phone && order.address.address) {
                addressContent.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center">
                            <span class="font-medium mr-3">${order.address.name}</span>
                            <span>${order.address.phone}</span>
                        </div>
                    </div>
                    <p>${order.address.address}</p>
                `;
            } else {
                // 如果订单中没有地址信息，使用默认地址
                addressContent.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center">
                            <span class="font-medium mr-3">吴*斌</span>
                            <span>15759890802</span>
                        </div>
                    </div>
                    <p>福建省泉州市丰泽区北峰工业区万科广场11栋113室</p>
                `;
            }
        }
    }
    
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

// 添加全局事件委托来处理编辑订单按钮的双击
document.addEventListener('dblclick', function(event) {
    if (event.target.classList.contains('edit-order-btn')) {
        const button = event.target;
        const orderType = button.getAttribute('data-order-type') || 'seller';
        openEditOrderModal(button, orderType);
    }
});

// 打开编辑订单数据模态框
function openEditOrderModal(button, orderType = 'seller') {
    // 获取对应的订单行和订单ID
    const orderRow = button.closest('tr');
    const orderId = orderRow.querySelector('td:nth-child(2)').textContent;
    
    // 查找对应的订单数据
    let order;
    if (orderType === 'buyer') {
        order = buyerOrders.find(o => o.id === orderId);
    } else {
        order = sellerOrders.find(o => o.id === orderId);
    }
    
    if (!order) {
        showToast('订单不存在', 2000);
        return;
    }
    
    // 存储当前编辑的订单类型
    button.setAttribute('data-order-type', orderType);
    
    // 创建编辑模态框（如果不存在）
    let editModal = document.getElementById('editOrderModal');
    if (!editModal) {
        editModal = document.createElement('div');
        editModal.id = 'editOrderModal';
        editModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        editModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                <div class="px-6 py-4 border-b flex justify-between items-center">
                    <h3 class="text-lg font-medium">编辑订单数据</h3>
                    <button id="closeEditModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="p-6">
                    <div id="editOrderForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">订单ID</label>
                                <input type="text" id="editOrderId" class="w-full p-2 border rounded" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">订单时间</label>
                                <input type="text" id="editOrderTime" class="w-full p-2 border rounded">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                                <input type="text" id="editItemName" class="w-full p-2 border rounded" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                                <input type="number" id="editQuantity" class="w-full p-2 border rounded" min="1">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">售价</label>
                                <input type="number" id="editPrice" class="w-full p-2 border rounded" min="0" step="0.01">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">成本价</label>
                                <input type="number" id="editCostPrice" class="w-full p-2 border rounded" min="0" step="0.01">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">订单状态</label>
                                <select id="editOrderStatus" class="w-full p-2 border rounded">
                                    <option value="待付款">待付款</option>
                                    <option value="待发货">待发货</option>
                                    <option value="待收货">待收货</option>
                                    <option value="已完成">已完成</option>
                                    <option value="已取消">已取消</option>
                                    <option value="已出售">已出售</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">买家名称</label>
                                <input type="text" id="editBuyerName" class="w-full p-2 border rounded">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button id="cancelEditOrder" class="px-4 py-2 border rounded hover:bg-gray-100">取消</button>
                    <button id="saveEditOrder" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">保存修改</button>
                </div>
            </div>
        `;
        document.body.appendChild(editModal);
        
        // 添加事件监听器
        document.getElementById('closeEditModal').addEventListener('click', closeEditOrderModal);
        document.getElementById('cancelEditOrder').addEventListener('click', closeEditOrderModal);
        document.getElementById('saveEditOrder').addEventListener('click', saveEditedOrder);
        
        // 点击模态框外部关闭
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditOrderModal();
            }
        });
    }
    
    // 填充表单数据
    document.getElementById('editOrderId').value = order.id;
    document.getElementById('editOrderTime').value = order.time;
    
    // 根据订单类型获取商品信息
    let item;
    if (orderType === 'buyer') {
        // 购买订单使用items数组
        item = order.items && order.items.length > 0 ? order.items[0] : {};
    } else {
        // 卖家订单使用item对象
        item = order.item || {};
    }
    
    document.getElementById('editItemName').value = item.name || '';
    document.getElementById('editQuantity').value = item.quantity || 1;
    document.getElementById('editPrice').value = item.price || 0;
    
    // 对于成本价和买家名称，根据订单类型做不同处理
    if (orderType === 'buyer') {
        // 购买订单可能没有成本价，设置为0或隐藏
        document.getElementById('editCostPrice').value = item.costPrice || 0;
        // 购买订单的买家名称就是当前用户，可能不需要修改
        document.getElementById('editBuyerName').value = order.buyer ? order.buyer.name : '我';
    } else {
        document.getElementById('editCostPrice').value = item.costPrice || 0;
        document.getElementById('editBuyerName').value = order.buyer ? order.buyer.name : '';
    }
    
    document.getElementById('editOrderStatus').value = order.status;
    
    // 显示模态框
    editModal.classList.remove('hidden');
}

// 关闭编辑订单模态框
function closeEditOrderModal() {
    const editModal = document.getElementById('editOrderModal');
    if (editModal) {
        editModal.classList.add('hidden');
    }
}

// 保存编辑后的订单数据
function saveEditedOrder() {
    const orderId = document.getElementById('editOrderId').value;
    
    // 首先在buyerOrders中查找订单
    let order = buyerOrders.find(o => o.id === orderId);
    let orderType = 'buyer';
    
    // 如果在buyerOrders中找不到，则在sellerOrders中查找
    if (!order) {
        order = sellerOrders.find(o => o.id === orderId);
        orderType = 'seller';
    }
    
    if (!order) {
        showToast('订单不存在', 2000);
        return;
    }
    
    // 获取表单数据
    const orderTime = document.getElementById('editOrderTime').value;
    const quantity = parseInt(document.getElementById('editQuantity').value);
    const price = parseFloat(document.getElementById('editPrice').value);
    const costPrice = parseFloat(document.getElementById('editCostPrice').value);
    const status = document.getElementById('editOrderStatus').value;
    const buyerName = document.getElementById('editBuyerName').value;
    
    // 验证数据
    if (isNaN(quantity) || quantity < 1 || isNaN(price) || price < 0) {
        showToast('请输入有效的数值', 2000);
        return;
    }
    
    // 只在成本价有效时验证（购买订单可能不需要成本价）
    if (!isNaN(costPrice) && costPrice < 0) {
        showToast('成本价不能为负数', 2000);
        return;
    }
    
    // 更新订单数据
    order.time = orderTime;
    order.status = status;
    
    // 根据订单类型更新商品信息
    if (orderType === 'buyer') {
        // 购买订单使用items数组
        if (order.items && order.items.length > 0) {
            order.items[0].quantity = quantity;
            order.items[0].price = price;
            
            // 如果有成本价，也更新
            if (!isNaN(costPrice)) {
                order.items[0].costPrice = costPrice;
            }
        }
    } else {
        // 卖家订单使用item对象
        if (order.item) {
            order.item.quantity = quantity;
            order.item.price = price;
            
            // 只在成本价有效时更新成本价相关数据
            if (!isNaN(costPrice)) {
                order.item.costPrice = costPrice;
                // 卖家订单计算成本总价和利润
                order.costTotal = costPrice * quantity;
                order.profit = (price - costPrice) * quantity;
            }
        }
        
        // 卖家订单可以修改买家名称
        if (!order.buyer) {
            // 如果buyer对象不存在，创建一个新的
            order.buyer = {};
        }
        order.buyer.name = buyerName;
    }
    
    // 更新订单总价
    order.total = price * quantity;
    
    // 根据订单类型重新渲染对应的订单列表
    if (orderType === 'buyer') {
        renderBuyerOrderList();
        // 重新计算累计消费金额
        calculateTotalSpent();
        // 更新订单统计信息
        calculateOrderStats();
    } else {
            renderSellerOrderList();
            // 更新订单统计信息
            calculateOrderStats();
        }
    
    // 保存订单数据到本地存储
    saveOrdersToLocalStorage();
    
    // 关闭模态框并显示提示
    closeEditOrderModal();
    showToast('订单数据已更新', 2000);
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

// 计算购买订单总金额
function calculateTotalSpent() {
    // 计算所有购买订单的总金额
    const totalSpent = buyerOrders.reduce((sum, order) => sum + order.total, 0);
    
    // 查找显示总金额的元素，如果没有则创建
    let totalSpentElement = document.getElementById('totalSpent');
    
    if (!totalSpentElement) {
        // 查找订单标题区域
        const orderHeader = document.querySelector('div.mb-8');
        if (orderHeader) {
            // 创建显示总金额的元素
            totalSpentElement = document.createElement('div');
            totalSpentElement.id = 'totalSpent';
            totalSpentElement.className = 'bg-primary/10 p-4 rounded-lg';
            totalSpentElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-700">累计消费金额：</p>
                    <p class="text-xl font-bold text-primary">¥${totalSpent.toLocaleString()}</p>
                </div>
            `;
            
            // 添加到订单标题区域下方
            orderHeader.appendChild(totalSpentElement);
        }
    } else {
        // 更新现有元素的金额
        totalSpentElement.querySelector('p.text-primary').textContent = `¥${totalSpent.toLocaleString()}`;
    }
    
    // 返回总金额，方便查看
    return totalSpent;
}

// 计算功能已移除，保留空函数以避免引用错误

// 页面初始化
window.addEventListener('DOMContentLoaded', function() {
    // 初始化功能按钮切换
    initToggleFunctionsButton();
    
    // 初始化查看操作按钮切换
    initToggleActionsButtons();
    
    // 尝试调用init函数，如果存在
    if (typeof init === 'function') {
        init();
    }
});

// 初始化查看操作按钮切换
function initToggleActionsButtons() {
    // 使用事件委托来处理所有查看操作按钮的点击事件
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('view-actions-btn')) {
            const button = event.target;
            const actionButtons = button.nextElementSibling;
            
            // 切换操作按钮的显示状态
            if (actionButtons && actionButtons.classList.contains('action-buttons')) {
                actionButtons.classList.toggle('hidden');
            }
        }
    });
    
    // 阻止数据按钮的默认单击行为，只允许双击响应
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-order-btn')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });
}

// 初始化功能按钮切换
function initToggleFunctionsButton() {
    const toggleFunctionsBtn = document.getElementById('toggleFunctionsBtn');
    const functionButtons = document.getElementById('functionButtons');
    
    if (toggleFunctionsBtn && functionButtons) {
        toggleFunctionsBtn.addEventListener('click', function() {
            functionButtons.classList.toggle('hidden');
        });
    }
    
    // 初始化导出订单按钮
    const exportOrdersBtn = document.getElementById('exportOrdersBtn');
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', function() {
            exportOrders();
        });
    }
}

// 导出订单功能
function exportOrders() {
    // 获取当前激活的选项卡
    const currentTab = document.getElementById('buyerTab').classList.contains('text-primary');
    
    // 根据选项卡选择要导出的订单
    const ordersToExport = currentTab ? buyerOrders : sellerOrders;
    
    // 转换为CSV格式
    const csvContent = convertToCSV(ordersToExport, currentTab);
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // 设置下载文件名
    const fileName = currentTab ? '购买订单_' + formatDate(new Date()).split(' ')[0] + '.csv' : '售卖订单_' + formatDate(new Date()).split(' ')[0] + '.csv';
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 显示提示
    showToast('订单导出成功！', 2000);
}

// 转换订单数据为CSV格式
function convertToCSV(orders, isBuyerOrders) {
    if (!orders || orders.length === 0) return '';
    
    let headers = '';
    let rows = '';
    
    if (isBuyerOrders) {
        // 购买订单CSV格式
        headers = '订单号,下单时间,商品名称,数量,单价,总价,订单状态\n';
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const row = [
                    '"' + order.id + '"',
                    '"' + order.time + '"',
                    '"' + item.name + '"',
                    item.quantity,
                    item.price,
                    order.total,
                    '"' + order.status + '"'
                ];
                rows += row.join(',') + '\n';
            });
        });
    } else {
        // 售卖订单CSV格式
        headers = '订单号,下单时间,商品名称,数量,售价,总价,订单状态\n';
        
        orders.forEach(order => {
            const row = [
                '"' + order.id + '"',
                '"' + order.time + '"',
                '"' + order.item.name + '"',
                order.item.quantity,
                order.item.price,
                order.total,
                '"' + order.status + '"'
            ];
            rows += row.join(',') + '\n';
        });
    }
    
    return headers + rows;
}

// 初始化用户下拉菜单
function initUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const showcaseMenuOption = document.getElementById('showcaseMenuOption');
    
    if (!userMenuBtn || !userDropdown || !showcaseMenuOption) return;
    
    // 点击用户图标显示/隐藏下拉菜单
    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
    
    // 点击页面其他地方隐藏下拉菜单
    document.addEventListener('click', function() {
        if (!userDropdown.classList.contains('hidden')) {
            userDropdown.classList.add('hidden');
        }
    });
    
    // 防止点击下拉菜单内部时关闭菜单
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 展示页面导航
    showcaseMenuOption.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'showcase.html';
        // 隐藏下拉菜单
        userDropdown.classList.add('hidden');
    });
}

// 初始化增加订单按钮事件
function initAddOrderButtons() {
    const addBuyerOrderBtn = document.getElementById('addBuyerOrderBtn');
    const addSellerOrderBtn = document.getElementById('addSellerOrderBtn');
    
    if (addBuyerOrderBtn) {
        addBuyerOrderBtn.addEventListener('click', function() {
            addNewBuyerOrder();
        });
    }
    
    if (addSellerOrderBtn) {
        addSellerOrderBtn.addEventListener('click', function() {
            addNewSellerOrder();
        });
    }
    
    // 初始化删除订单按钮的事件委托
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-order-btn')) {
            const orderRow = e.target.closest('tr');
            // 尝试从"查看详情"按钮获取订单ID
            const viewDetailBtn = orderRow.querySelector('[data-order-id]');
            const orderId = viewDetailBtn ? viewDetailBtn.getAttribute('data-order-id') : null;
            
            // 如果没找到，尝试直接从第二个td元素获取订单ID
            const orderIdTd = orderRow.querySelector('td:nth-child(2)');
            const orderIdFromTd = orderIdTd ? orderIdTd.textContent : null;
            
            // 使用找到的订单ID，如果都没找到则显示错误
            const finalOrderId = orderId || orderIdFromTd;
            const orderType = e.target.getAttribute('data-order-type');
            
            if (finalOrderId) {
                deleteOrder(finalOrderId, orderType);
            } else {
                showToast('无法获取订单ID', 2000);
            }
        }
    });
}

// 计算并显示订单统计信息
function calculateOrderStats() {
    // 计算购买订单总额
    const buyerTotal = buyerOrders.reduce((sum, order) => sum + order.total, 0);
    
    // 计算卖家订单总额
    const sellerTotal = sellerOrders.reduce((sum, order) => sum + order.total, 0);
    
    // 更新页面显示
    const buyerTotalAmount = document.getElementById('buyerTotalAmount');
    const sellerTotalAmount = document.getElementById('sellerTotalAmount');
    
    if (buyerTotalAmount) {
        buyerTotalAmount.textContent = '¥' + buyerTotal.toLocaleString();
    }
    
    if (sellerTotalAmount) {
        sellerTotalAmount.textContent = '¥' + sellerTotal.toLocaleString();
    }
}

// 添加新的购买订单
function addNewBuyerOrder() {
    // 创建新订单
    const newOrder = {
        id: 'ORD' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0'),
        time: formatDate(new Date()),
        status: '已完成',
        items: [
            {
                id: 'RTX5090_NEW' + Math.floor(Math.random() * 1000),
                name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
                image: 'images/rtx5090.png',
                price: 24999,
                quantity: 1
            }
        ],
        total: 24999,
        address: {
            name: '吴*斌',
            phone: '15759890802',
            address: '福建省泉州市丰泽区万科二期102室'
        }
    };
    
    // 添加到订单数组
    buyerOrders.unshift(newOrder);
    
    // 重新渲染订单列表
    renderBuyerOrderList();
    
    // 更新订单总数
    updateTotalOrders();
    
    // 更新统计信息
    calculateOrderStats();
    
    // 保存订单数据到本地存储
    saveOrdersToLocalStorage();
    
    // 显示提示
    showToast('购买订单添加成功！', 2000);
    
    // 打开编辑模态框，允许用户编辑新订单
    setTimeout(() => {
        openEditOrderModal(newOrder.id, 'buyer');
    }, 500);
}

// 添加新的卖家订单
function addNewSellerOrder() {
    // 成本价配置
    const gpuCostPrices = {
        'NVIDIA GeForce RTX 5090 24GB GDDR7': 28000,
        'NVIDIA GeForce RTX 4090 24GB GDDR6X': 15000
    };
    
    // 买家信息
    const buyerInfo = {
        name: '新买家',
        phone: '138*****123',
        address: '上海市浦东新区张江高科技园区'
    };
    
    // 创建新订单
    const orderItem = {
        id: 'RTX5090_SELL_NEW' + Math.floor(Math.random() * 1000),
        name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
        image: 'images/rtx5090.png',
        price: 25999,
        costPrice: gpuCostPrices['NVIDIA GeForce RTX 5090 24GB GDDR7'],
        quantity: 1
    };
    
    const newOrder = {
        id: 'SEL' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0'),
        time: formatDate(new Date()),
        status: '已出售',
        item: orderItem,
        total: orderItem.price * orderItem.quantity,
        costTotal: orderItem.costPrice * orderItem.quantity,
        profit: (orderItem.price - orderItem.costPrice) * orderItem.quantity,
        buyer: buyerInfo
    };
    
    // 添加到订单数组
    sellerOrders.unshift(newOrder);
    
    // 检查当前是否显示卖家订单列表
    const sellerTab = document.getElementById('sellerTab');
    if (sellerTab && sellerTab.classList.contains('text-primary')) {
        renderSellerOrderList();
    }
    
    // 更新订单总数
    updateTotalOrders();
    
    // 更新统计信息
    calculateOrderStats();
    
    // 保存订单数据到本地存储
    saveOrdersToLocalStorage();
    
    // 显示提示
    showToast('卖家订单添加成功！', 2000);
    
    // 打开编辑模态框，允许用户编辑新订单
    setTimeout(() => {
        openEditOrderModal(newOrder.id, 'seller');
    }, 500);
}

// 保存订单数据到本地存储
function saveOrdersToLocalStorage() {
    const ordersData = {
        buyerOrders: buyerOrders,
        sellerOrders: sellerOrders
    };
    localStorage.setItem('orders', JSON.stringify(ordersData));
}

// 删除订单
function deleteOrder(orderId, orderType) {
    if (confirm('确定要删除这个订单吗？')) {
        if (orderType === 'buyer') {
            // 删除购买订单
            const orderIndex = buyerOrders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                buyerOrders.splice(orderIndex, 1);
                renderBuyerOrderList();
            }
        } else {
            // 删除卖家订单
            const orderIndex = sellerOrders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                sellerOrders.splice(orderIndex, 1);
                
                // 检查当前是否显示卖家订单列表
                const sellerTab = document.getElementById('sellerTab');
                if (sellerTab && sellerTab.classList.contains('text-primary')) {
                    renderSellerOrderList();
                }
            }
        }
        
        // 更新订单总数
        updateTotalOrders();
        
        // 更新统计信息
        calculateOrderStats();
        
        // 保存订单数据到本地存储
        saveOrdersToLocalStorage();
        
        // 显示提示
        showToast('订单删除成功！', 2000);
    }
}