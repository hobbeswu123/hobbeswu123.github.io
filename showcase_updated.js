// 商品数据
const products = [
    {
        id: 1,
        name: 'NVIDIA GeForce RTX 5090 24GB GDDR7',
        price: 23999,
        rating: 4.9,
        reviewCount: 128,
        image: 'images/rtx5090.png',
        specs: 'NVIDIA Ada Lovelace架构，24GB GDDR7显存，19200 CUDA核心',
        category: 'Graphics Cards',
        tags: ['High End', 'Gaming', 'RTX'],
        isNew: true
    },
    {
        id: 2,
        name: 'NVIDIA GeForce RTX 5080 16GB GDDR7',
        price: 15999,
        rating: 4.8,
        reviewCount: 95,
        image: 'images/rtx5080.png',
        specs: 'NVIDIA Ada Lovelace架构，16GB GDDR7显存，14400 CUDA核心',
        category: 'Graphics Cards',
        tags: ['High End', 'Gaming', 'RTX']
    },
    {
        id: 3,
        name: 'NVIDIA GeForce RTX 5070 12GB GDDR7',
        price: 9999,
        rating: 4.7,
        reviewCount: 67,
        image: 'images/rtx5070.png',
        specs: 'NVIDIA Ada Lovelace架构，12GB GDDR7显存，8400 CUDA核心',
        category: 'Graphics Cards',
        tags: ['Mid Range', 'Gaming', 'RTX']
    }
];

// 生成星级评分
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fa fa-star text-yellow-400"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fa fa-star-half-o text-yellow-400"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="fa fa-star-o text-yellow-400"></i>';
    }
    
    return stars;
}

// 初始化用户下拉菜单
function initUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const userMenu = document.getElementById('userMenu');
    
    if (!userDropdown || !userMenu) return;
    
    userDropdown.addEventListener('click', function() {
        userMenu.classList.toggle('hidden');
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(event) {
        if (!userDropdown.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
    });
}

// 计算并显示橱窗总计信息
function calculateAndDisplayTotals(products) {
    const totalProducts = document.getElementById('totalProducts');
    const totalValue = document.getElementById('totalValue');
    const avgRating = document.getElementById('avgRating');
    
    if (!totalProducts || !totalValue || !avgRating) return;
    
    const total = products.length;
    const sumValue = products.reduce((sum, product) => sum + product.price, 0);
    const sumRating = products.reduce((sum, product) => sum + product.rating, 0);
    const averageRating = total > 0 ? (sumRating / total).toFixed(1) : '0.0';
    
    totalProducts.textContent = total;
    totalValue.textContent = `¥${sumValue.toLocaleString()}`;
    avgRating.textContent = averageRating;
}

// 生成卖家橱窗商品卡片
function generateSellerShowcase() {
    const showcaseContainer = document.getElementById('sellerShowcase');
    if (!showcaseContainer) return;
    
    let html = '';
    
    products.forEach(product => {
        const stars = generateStars(product.rating);
        const isNewBadge = product.isNew ? '<span class="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">新品</span>' : '';
        
        html += `
            <div class="col-span-12 sm:col-span-6 lg:col-span-4">
                <div class="card-hover group relative overflow-hidden border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    ${isNewBadge}
                    <div class="aspect-w-1 aspect-h-1">
                        <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-64">
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium mb-2 line-clamp-2">${product.name}</h3>
                        <div class="flex items-center mb-2">
                            <div class="flex mr-2">${stars}</div>
                            <span class="text-sm text-gray-500">(${product.reviewCount})</span>
                        </div>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2">${product.specs}</p>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xl font-bold text-primary">¥${product.price.toLocaleString()}</span>
                            <button class="publish-to-marketplace btn-primary px-4 py-2 rounded text-white transition-colors duration-200 hover:bg-primary/90"
                                data-id="${product.id}"
                                data-name="${product.name}">
                                发布
                            </button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${product.tags.map(tag => `<span class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="flex space-x-3">
                            <button class="btn-primary px-4 py-2 rounded text-white transition-colors duration-200 hover:bg-primary/90">
                                购买
                            </button>
                            <button class="btn-outline px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200">
                                加入购物车
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    showcaseContainer.innerHTML = html;
    
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
        if (!button.classList.contains('publish-to-marketplace')) {
            button.addEventListener('click', function() {
                const productCard = this.closest('.card-hover');
                const productName = productCard.querySelector('h3').textContent;
                alert(`已将商品 "${productName}" 加入购物车！`);
                // 更新购物车数量
                updateCartCount();
            });
        }
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

// 显示提示信息
function showToast(message, type = 'success') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    // 设置不同类型的样式
    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-red-500', 'text-white');
    } else if (type === 'info') {
        toast.classList.add('bg-blue-500', 'text-white');
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // 3秒后隐藏toast
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 发布商品到市场
function publishToMarketplace(productId, productName) {
    // 模拟发布过程
    setTimeout(() => {
        showToast(`商品 "${productName}" 已成功发布到市场！`);
    }, 500);
}

// 更新购物车数量显示
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    // 获取当前购物车数量并加1
    let currentCount = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = currentCount + 1;
}

// 返回顶部按钮功能
function initBackToTopButton() {
    // 创建返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'backToTop';
    backToTopButton.className = 'fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg opacity-0 invisible transition-all duration-300 z-40';
    backToTopButton.innerHTML = '<i class="fa fa-arrow-up"></i>';
    backToTopButton.title = '返回顶部';
    
    // 添加到页面
    document.body.appendChild(backToTopButton);
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });
    
    // 点击事件 - 平滑滚动到顶部
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 页面初始化
window.addEventListener('DOMContentLoaded', function() {
    // 生成售卖橱窗商品卡片
    generateSellerShowcase();
    
    // 初始化用户下拉菜单
    initUserDropdown();
    
    // 初始化返回顶部按钮
    initBackToTopButton();
});