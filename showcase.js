// 全局变量存储订单数据
let buyerOrders = [];
let sellerOrders = [];

// 生成星级评分HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // 添加实心星星
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa fa-star"></i>';
    }
    
    // 添加半星（如果需要）
    if (hasHalfStar) {
        starsHtml += '<i class="fa fa-star-half-o"></i>';
    }
    
    // 添加空心星星
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa fa-star-o"></i>';
    }
    
    return starsHtml;
}

// 初始化用户下拉菜单
function initUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userMenuBtn || !userDropdown) return;
    
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
}

// 计算并显示橱窗总计信息
function calculateAndDisplayTotals(products) {
    // 计算商品总数
    const totalProducts = products.length;
    
    // 计算总库存量
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    
    // 计算商品总价值（按销售价格计算）
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    
    // 更新UI显示
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('totalValue').textContent = `¥${totalValue.toLocaleString()}`;
}

// 生成售卖橱窗的商品卡片
function generateSellerShowcase() {
    const showcase = document.getElementById('sellerShowcase');
    if (!showcase) return;
    
    // 定义要展示的商品信息
    const products = [
        {
            id: 'seller-1',
            name: 'NVIDIA GeForce RTX 5090',
            price: 19800,
            originalPrice: 20100,
            image: 'images/rtx5090.png',
            description: '全新Ada Lovelace架构，24GB GDDR6X显存，为游戏和创作提供无与伦比的性能',
            status: '新品',
            stock: 5,
            rating: 4.9,
            reviews: 28
        },
        {
            id: 'seller-2',
            name: 'NVIDIA GeForce RTX 4090',
            price: 12799,
            originalPrice: 12999,
            image: 'images/rtx4090.png',
            description: '强大的24GB GDDR6X显存，适合4K游戏和专业创意工作流程',
            status: '热销',
            stock: 8,
            rating: 4.8,
            reviews: 120
        },
        {
            id: 'seller-3',
            name: 'NVIDIA GeForce RTX 5090 (特别优惠)',
            price: 19500,
            originalPrice: 20100,
            image: 'images/rtx5090.png',
            description: '限时优惠，RTX 5090顶级显卡，赠散热支架和延长线',
            status: '限时优惠',
            stock: 3,
            rating: 5.0,
            reviews: 15
        }
    ];
    
    // 清空橱窗
    showcase.innerHTML = '';
    
    // 为每个商品生成卡片
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl overflow-hidden shadow-md card-hover';
        card.setAttribute('data-id', product.id);
        
        // 生成星级评分HTML
        const starsHtml = generateStars(product.rating);
        
        // 设置卡片HTML内容
        card.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover">
                ${product.status ? `<span class="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">${product.status}</span>` : ''}
                <!-- 发布到售卖大厅按钮 -->
                <button class="publish-to-marketplace absolute top-3 right-3 bg-accent text-white p-2 rounded-full hover:bg-accent/90 transition-colors" title="发布到售卖大厅" data-id="${product.id}" data-name="${product.name}">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                <div class="flex items-center mb-3">
                    <div class="flex text-yellow-400">
                        ${starsHtml}
                    </div>
                    <span class="ml-2 text-gray-600 text-sm">${product.rating} (${product.reviews}评价)</span>
                </div>
                <p class="text-gray-600 mb-4 text-sm">${product.description}</p>
                <div class="mb-4">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-2xl font-bold text-primary">¥${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? `<span class="text-gray-400 line-through text-sm">¥${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="text-sm text-gray-500">库存: ${product.stock}件</div>
                </div>
                <div class="flex space-x-2">
                    <button class="btn-primary py-2 px-4 flex-1">立即购买</button>
                    <button class="btn-outline py-2 px-4">加入购物车</button>
                </div>
            </div>
        `;
        
        // 添加到橱窗
        showcase.appendChild(card);
    });
    
    // 显示提示信息
function showToast(message) {
    // 检查是否已存在toast元素
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // 创建toast元素
        toast = document.createElement('div');
        toast.className = 'toast fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-y-10 opacity-0 transition-all duration-300';
        document.body.appendChild(toast);
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 显示toast
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    // 3秒后隐藏toast
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

// 将商品发布到售卖大厅
function publishToMarketplace(productId, productName) {
    // 显示发布成功提示
    showToast(`${productName} 已发布到售卖大厅`);
    
    // 这里可以添加更多发布逻辑，比如更新UI状态、发送请求到服务器等
    console.log(`发布商品到售卖大厅: ${productId} - ${productName}`);
}

// 为所有发布按钮添加点击事件
    document.querySelectorAll('.publish-to-marketplace').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            publishToMarketplace(productId, productName);
        });
    });
    
    // 为购买按钮添加点击事件
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.card-hover');
            const productName = productCard.querySelector('h3').textContent;
            alert(`已将商品 "${productName}" 加入购物车！`);
            // 更新购物车数量
            updateCartCount();
        });
    });
    
    // 为加入购物车按钮添加点击事件
    document.querySelectorAll('.btn-outline').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.card-hover');
            const productName = productCard.querySelector('h3').textContent;
            alert(`已将商品 "${productName}" 加入购物车！`);
            // 更新购物车数量
            updateCartCount();
        });
    });
    
    // 计算并显示总计信息
    calculateAndDisplayTotals(products);
}

// 更新购物车数量显示
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    // 获取当前购物车数量并加1
    let currentCount = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = currentCount + 1;
}

// 初始化订单数据
function initOrderData() {
    // 生成购买订单数据
    buyerOrders = generateBuyerOrderData();
    // 生成卖家订单数据
    sellerOrders = generateSellerOrderData();
}

// 生成购买订单数据
function generateBuyerOrderData() {
    const orders = [];
    const statuses = ['待付款', '待发货', '待收货', '已完成', '已取消'];
    const products = [
        { name: '智能手表Pro', price: 1299, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2219.484375%22%20y%3D%2233.5%22%3EWatch%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '无线蓝牙耳机', price: 799, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2210.484375%22%20y%3D%2233.5%22%3EHeadphones%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '超薄笔记本电脑', price: 8999, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2210.484375%22%20y%3D%2233.5%22%3ELaptop%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '智能扫地机器人', price: 2499, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.484375%22%20y%3D%2233.5%22%3ERobot%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '高端咖啡机', price: 1999, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2215.484375%22%20y%3D%2233.5%22%3ECoffee%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' }
    ];
    
    // 使用单独设置的数组来存储日期、产品索引、数量和状态
    const orderDates = [
        '2025-05-10T14:20:00', '2025-05-08T09:15:00', '2025-05-05T16:40:00',
        '2025-05-03T11:30:00', '2025-05-01T18:50:00', '2025-04-29T13:10:00',
        '2025-04-27T08:45:00', '2025-04-25T15:25:00', '2025-04-23T10:35:00',
        '2025-04-21T17:20:00'
    ];
    
    const productIndices = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]; // 对应上面products数组的索引
    const quantities = [1, 2, 1, 3, 2, 1, 3, 2, 1, 2]; // 购买数量
    const orderStatuses = ['已完成', '待发货', '待收货', '已完成', '已取消', '待付款', '已完成', '待发货', '待收货', '已完成'];

    for (let i = 0; i < 10; i++) {
        const productIndex = productIndices[i];
        const selectedProduct = products[productIndex];
        const quantity = quantities[i];
        const totalAmount = selectedProduct.price * quantity;
        const status = orderStatuses[i];
        const date = new Date(orderDates[i]);

        orders.push({
            id: `ORD${Date.now()}${i}`,
            time: date.toISOString(),
            status: status,
            products: [{
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                image: selectedProduct.image
            }],
            totalAmount: totalAmount
        });
    }

    return orders;
}

// 生成卖家订单数据
function generateSellerOrderData() {
    const orders = [];
    const statuses = ['待发货', '待收货', '已完成', '已出售'];
    const products = [
        { name: '高级西装定制', price: 4999, costPrice: 3500, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2218.484375%22%20y%3D%2233.5%22%3ESuit%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '限量版运动鞋', price: 2499, costPrice: 1800, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2215.484375%22%20y%3D%2233.5%22%3EShoes%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '艺术品收藏品', price: 15999, costPrice: 12000, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2217.484375%22%20y%3D%2233.5%22%3EArt%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '奢侈品手包', price: 18999, costPrice: 13000, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2219.484375%22%20y%3D%2233.5%22%3EBag%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: '高端葡萄酒', price: 2999, costPrice: 1500, image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2216.484375%22%20y%3D%2233.5%22%3EWine%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
        { name: 'NVIDIA GeForce RTX 5090 24GB GDDR7', price: 23999, costPrice: 28000, image: 'images/rtx5090.png' }
    ];
    const buyers = ['张*明', '李*华', '王*伟', '赵*丽', '陈*静'];
    
    // 使用单独设置的数组来存储日期、产品索引、数量、状态和买家索引
    const orderDates = [
        '2025-03-05T15:34:12', '2025-05-08T11:30:00', '2025-05-06T14:20:00', '2025-05-04T09:45:00',
        '2025-05-02T16:10:00', '2025-04-30T10:55:00', '2025-04-28T15:30:00',
        '2025-04-26T11:20:00', '2025-04-24T14:45:00'
    ];
    
    const productIndices = [5, 0, 1, 2, 3, 4, 0, 1, 2]; // 对应上面products数组的索引，5表示RTX 5090
    const quantities = [1, 1, 2, 1, 1, 2, 1, 1, 2]; // 销售数量
    const orderStatuses = ['已出售', '已完成', '待发货', '已出售', '待收货', '已完成', '已出售', '待发货', '待收货']; // 订单状态
    const buyerIndices = [0, 1, 2, 3, 4, 0, 1, 2, 3]; // 对应上面buyers数组的索引

    for (let i = 0; i < 9; i++) {
        const productIndex = productIndices[i];
        const selectedProduct = products[productIndex];
        const quantity = quantities[i];
        const totalAmount = selectedProduct.price * quantity;
        const totalCost = selectedProduct.costPrice * quantity;
        const status = orderStatuses[i];
        const date = new Date(orderDates[i]);
        const buyerIndex = buyerIndices[i];
        const selectedBuyer = buyers[buyerIndex];

        orders.push({
            id: `ORD${Date.now()}${i+10}`,
            time: date.toISOString(),
            status: status,
            product: {
                name: selectedProduct.name,
                price: selectedProduct.price,
                costPrice: selectedProduct.costPrice,
                quantity: quantity,
                image: selectedProduct.image
            },
            buyer: selectedBuyer,
            totalAmount: totalAmount,
            totalCost: totalCost
        });
    }

    // 确保总亏损约15万
    const lossOrder = {
        id: `ORD${Date.now()}SPECIAL`,
        time: '2025-05-10T10:00:00',
        status: '已完成',
        product: {
                name: '高端珠宝首饰',
                price: 10000,
                costPrice: 160000,
                quantity: 1,
                image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2060%2060%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5f993481%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5f993481%22%3E%3Crect%20width%3D%2260%22%20height%3D%2260%22%20fill%3D%22%23999%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.484375%22%20y%3D%2233.5%22%3EJewelry%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'            },
        buyer: '刘*洋',
        totalAmount: 10000,
        totalCost: 160000
    };
    orders.push(lossOrder);

    // 按时间降序排序
    return orders.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// 渲染购买订单列表
function renderBuyerOrderList(filterStatus = '全部订单') {
    const orderListElement = document.getElementById('buyerOrderList');
    if (!orderListElement) return;
    
    let filteredOrders = buyerOrders;

    if (filterStatus !== '全部订单') {
        filteredOrders = buyerOrders.filter(order => order.status === filterStatus);
    }

    if (filteredOrders.length === 0) {
        orderListElement.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-gray-500">
                    <i class="fa fa-inbox-o text-4xl mb-3"></i>
                    <p>暂无订单记录</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filteredOrders.forEach(order => {
        const orderDate = formatDate(order.time);
        const statusBadge = getStatusBadge(order.status);
        const actionButtons = getActionButtons(order.status);
        const product = order.products[0];

        html += `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-4 px-6">
                    <div class="flex items-center">
                        <input type="checkbox" class="form-checkbox text-primary h-4 w-4 rounded">
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="font-medium">${order.id}</span>
                </td>
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <p class="font-medium">${product.name}</p>
                            <p class="text-gray-500 text-xs">x${product.quantity}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="font-bold text-primary">¥${order.totalAmount.toFixed(2)}</span>
                </td>
                <td class="py-4 px-6">
                    ${orderDate}
                </td>
                <td class="py-4 px-6">
                    ${statusBadge}
                </td>
                <td class="py-4 px-6">
                    <div class="flex space-x-2">
                        <button class="btn-primary py-1 px-3 text-xs" onclick="openOrderDetailModal('${order.id}', 'buyer')">查看详情</button>
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    });

    orderListElement.innerHTML = html;
    updateTotalOrdersCount(filteredOrders.length);
}

// 渲染卖家订单列表
function renderSellerOrderList(filterStatus = '全部订单') {
    const orderListElement = document.getElementById('sellerOrderList');
    if (!orderListElement) return;
    
    let filteredOrders = sellerOrders;

    if (filterStatus !== '全部订单') {
        filteredOrders = sellerOrders.filter(order => order.status === filterStatus);
    }

    if (filteredOrders.length === 0) {
        orderListElement.innerHTML = `
            <tr>
                <td colspan="8" class="py-12 text-center text-gray-500">
                    <i class="fa fa-inbox-o text-4xl mb-3"></i>
                    <p>暂无订单记录</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filteredOrders.forEach(order => {
        const orderDate = formatDate(order.time);
        const statusBadge = getStatusBadge(order.status);
        const actionButtons = getSellerActionButtons(order.status);
        const profit = (order.totalAmount - order.totalCost).toFixed(2);
        const profitClass = profit >= 0 ? 'text-green-500' : 'text-red-500';

        html += `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-4 px-6">
                    <div class="flex items-center">
                        <input type="checkbox" class="form-checkbox text-primary h-4 w-4 rounded">
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="font-medium">${order.id}</span>
                </td>
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <img src="${order.product.image}" alt="${order.product.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <p class="font-medium">${order.product.name}</p>
                            <p class="text-gray-500 text-xs">x${order.product.quantity}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <p>${order.buyer}</p>
                </td>
                <td class="py-4 px-6">
                    <div>
                        <p class="font-bold text-primary">¥${order.totalAmount.toFixed(2)}</p>
                        <p class="text-xs ${profitClass}">利润: ${profit >= 0 ? '+' : ''}¥${profit}</p>
                    </div>
                </td>
                <td class="py-4 px-6">
                    ${orderDate}
                </td>
                <td class="py-4 px-6">
                    ${statusBadge}
                </td>
                <td class="py-4 px-6">
                    <div class="flex space-x-2">
                        <button class="btn-primary py-1 px-3 text-xs" onclick="openOrderDetailModal('${order.id}', 'seller')">查看详情</button>
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    });

    orderListElement.innerHTML = html;
    updateTotalOrdersCount(filteredOrders.length);
}

// 获取订单状态徽章
function getStatusBadge(status) {
    let badgeClass = '';
    switch(status) {
        case '待付款':
            badgeClass = 'bg-yellow-100 text-yellow-800';
            break;
        case '待发货':
            badgeClass = 'bg-blue-100 text-blue-800';
            break;
        case '待收货':
            badgeClass = 'bg-purple-100 text-purple-800';
            break;
        case '已完成':
        case '已出售':
            badgeClass = 'bg-green-100 text-green-800';
            break;
        case '已取消':
            badgeClass = 'bg-gray-100 text-gray-800';
            break;
        default:
            badgeClass = 'bg-gray-100 text-gray-800';
    }

    return `<span class="px-2 py-1 rounded-full text-xs ${badgeClass}">${status}</span>`;
}

// 获取购买订单操作按钮
function getActionButtons(status) {
    let buttons = '';
    switch(status) {
        case '待付款':
            buttons = `
                <button class="btn-primary py-1 px-3 text-xs">去付款</button>
                <button class="btn-outline py-1 px-3 text-xs">取消订单</button>
            `;
            break;
        case '待发货':
            buttons = `
                <button class="btn-outline py-1 px-3 text-xs">提醒发货</button>
                <button class="btn-outline py-1 px-3 text-xs">申请退款</button>
            `;
            break;
        case '待收货':
            buttons = `
                <button class="btn-primary py-1 px-3 text-xs">确认收货</button>
                <button class="btn-outline py-1 px-3 text-xs">查看物流</button>
            `;
            break;
        case '已完成':
            buttons = `
                <button class="btn-outline py-1 px-3 text-xs">申请售后</button>
                <button class="btn-outline py-1 px-3 text-xs">再次购买</button>
            `;
            break;
    }
    return buttons;
}

// 获取卖家订单操作按钮
function getSellerActionButtons(status) {
    let buttons = '';
    switch(status) {
        case '待发货':
            buttons = `
                <button class="btn-primary py-1 px-3 text-xs">去发货</button>
            `;
            break;
        case '待收货':
            buttons = `
                <button class="btn-outline py-1 px-3 text-xs">提醒收货</button>
            `;
            break;
    }
    return buttons;
}

// 打开订单详情模态框
function openOrderDetailModal(orderId, orderType) {
    const modal = document.getElementById('orderDetailModal');
    if (!modal) return;
    
    const order = orderType === 'buyer' 
        ? buyerOrders.find(o => o.id === orderId) 
        : sellerOrders.find(o => o.id === orderId);

    if (!order) return;

    // 填充订单基本信息
    const detailOrderId = document.getElementById('detailOrderId');
    const detailOrderTime = document.getElementById('detailOrderTime');
    const detailOrderStatus = document.getElementById('detailOrderStatus');
    if (detailOrderId) detailOrderId.textContent = order.id;
    if (detailOrderTime) detailOrderTime.textContent = formatDate(order.time);
    if (detailOrderStatus) {
        detailOrderStatus.textContent = order.status;
        detailOrderStatus.className = getStatusTextClass(order.status);
    }

    // 填充商品清单
    const itemsContainer = document.getElementById('detailOrderItems');
    if (!itemsContainer) return;
    
    let itemsHtml = '';
    let subtotal = 0;

    if (orderType === 'buyer') {
        order.products.forEach(product => {
            const itemTotal = product.price * product.quantity;
            subtotal += itemTotal;
            itemsHtml += `
                <tr class="border-t">
                    <td class="py-3 px-4">
                        <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
                    </td>
                    <td class="py-3 px-4">
                        <p class="font-medium">${product.name}</p>
                    </td>
                    <td class="py-3 px-4">
                        ¥${product.price.toFixed(2)}
                    </td>
                    <td class="py-3 px-4">
                        ${product.quantity}
                    </td>
                    <td class="py-3 px-4 font-medium">
                        ¥${itemTotal.toFixed(2)}
                    </td>
                </tr>
            `;
        });
    } else {
        const itemTotal = order.product.totalAmount;
        subtotal = itemTotal;
        itemsHtml = `
            <tr class="border-t">
                <td class="py-3 px-4">
                    <img src="${order.product.image}" alt="${order.product.name}" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="py-3 px-4">
                    <p class="font-medium">${order.product.name}</p>
                </td>
                <td class="py-3 px-4">
                    ¥${order.product.price.toFixed(2)}
                </td>
                <td class="py-3 px-4">
                    ${order.product.quantity}
                </td>
                <td class="py-3 px-4 font-medium">
                    ¥${itemTotal.toFixed(2)}
                </td>
            </tr>
        `;
    }

    itemsContainer.innerHTML = itemsHtml;
    
    // 更新金额信息
    const detailSubtotal = document.getElementById('detailSubtotal');
    const detailTotal = document.getElementById('detailTotal');
    if (detailSubtotal) detailSubtotal.textContent = `¥${subtotal.toFixed(2)}`;
    if (detailTotal) detailTotal.textContent = `¥${subtotal.toFixed(2)}`;

    // 显示模态框
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// 获取状态文本样式类
function getStatusTextClass(status) {
    let className = 'font-medium';
    switch(status) {
        case '待付款':
            className += ' text-yellow-500';
            break;
        case '待发货':
            className += ' text-blue-500';
            break;
        case '待收货':
            className += ' text-purple-500';
            break;
        case '已完成':
        case '已出售':
            className += ' text-green-500';
            break;
        case '已取消':
            className += ' text-gray-500';
            break;
    }
    return className;
}

// 关闭订单详情模态框
function closeDetailModal() {
    const modal = document.getElementById('orderDetailModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// 更新订单总数
function updateTotalOrdersCount(count) {
    const totalOrders = document.getElementById('totalOrders');
    if (totalOrders) {
        totalOrders.textContent = count;
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 初始化选项卡切换
function initTabSwitching() {
    const buyerTab = document.getElementById('buyerTab');
    const sellerTab = document.getElementById('sellerTab');
    const buyerContainer = document.getElementById('buyerOrdersContainer');
    const sellerContainer = document.getElementById('sellerOrdersContainer');
    const statusFilter = document.getElementById('orderStatusFilter');
    
    if (!buyerTab || !sellerTab || !buyerContainer || !sellerContainer) return;

    buyerTab.addEventListener('click', () => {
        buyerTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        buyerTab.classList.remove('text-gray-500');
        sellerTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
        sellerTab.classList.add('text-gray-500');
        buyerContainer.classList.remove('hidden');
        sellerContainer.classList.add('hidden');
        if (statusFilter) {
            renderBuyerOrderList(statusFilter.value);
        } else {
            renderBuyerOrderList();
        }
    });

    sellerTab.addEventListener('click', () => {
        sellerTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        sellerTab.classList.remove('text-gray-500');
        buyerTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
        buyerTab.classList.add('text-gray-500');
        sellerContainer.classList.remove('hidden');
        buyerContainer.classList.add('hidden');
        if (statusFilter) {
            renderSellerOrderList(statusFilter.value);
        } else {
            renderSellerOrderList();
        }
    });

    // 订单状态筛选
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            if (!sellerContainer.classList.contains('hidden')) {
                renderSellerOrderList(statusFilter.value);
            } else {
                renderBuyerOrderList(statusFilter.value);
            }
        });
    }
}

// 初始化订单模态框事件
function initOrderModalEvents() {
    const closeButton = document.getElementById('closeDetailModal');
    const modal = document.getElementById('orderDetailModal');
    
    if (!closeButton || !modal) return;

    closeButton.addEventListener('click', closeDetailModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDetailModal();
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeDetailModal();
        }
    });
}

// 页面初始化
window.addEventListener('DOMContentLoaded', function() {
    // 生成售卖橱窗商品卡片
    generateSellerShowcase();
    
    // 初始化用户下拉菜单
    initUserDropdown();
    
    // 初始化订单功能
    initOrderData();
    renderBuyerOrderList();
    initTabSwitching();
    initOrderModalEvents();
});