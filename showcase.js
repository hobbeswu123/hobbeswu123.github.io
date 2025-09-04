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
    
    // 为所有发布按钮添加点击事件
    document.querySelectorAll('.publish-to-marketplace').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            alert(`已将商品 "${productName}" 发布到售卖大厅！`);
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

// 页面初始化
window.addEventListener('DOMContentLoaded', function() {
    // 生成售卖橱窗商品卡片
    generateSellerShowcase();
    
    // 初始化用户下拉菜单
    initUserDropdown();
});