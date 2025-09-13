/**
 * 代码块优化功能
 * 实现行号显示、折叠展开、语言显示、一键复制等功能
 */

(function() {
    'use strict';

    // 语言图标映射
    const languageIcons = {
        'python': 'Py',
        'javascript': 'JS',
        'java': 'Ja',
        'cpp': 'C++',
        'c': 'C',
        'html': 'H',
        'css': 'C',
        'json': 'J',
        'xml': 'X',
        'sql': 'S',
        'bash': 'B',
        'shell': 'S',
        'php': 'P',
        'ruby': 'R',
        'go': 'Go',
        'rust': 'R',
        'swift': 'S',
        'kotlin': 'K',
        'typescript': 'T',
        'default': '?'
    };

    // 语言名称映射
    const languageNames = {
        'python': 'Python',
        'javascript': 'JavaScript',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C',
        'html': 'HTML',
        'css': 'CSS',
        'json': 'JSON',
        'xml': 'XML',
        'sql': 'SQL',
        'bash': 'Bash',
        'shell': 'Shell',
        'php': 'PHP',
        'ruby': 'Ruby',
        'go': 'Go',
        'rust': 'Rust',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'typescript': 'TypeScript',
        'default': 'Code'
    };

    /**
     * 获取语言信息
     */
    function getLanguageInfo(className) {
        const match = className.match(/language-(\w+)/);
        if (match) {
            const lang = match[1].toLowerCase();
            return {
                key: lang,
                icon: languageIcons[lang] || languageIcons.default,
                name: languageNames[lang] || languageNames.default
            };
        }
        return {
            key: 'default',
            icon: languageIcons.default,
            name: languageNames.default
        };
    }

    /**
     * 计算代码行数
     */
    function countLines(codeElement) {
        const text = codeElement.textContent || codeElement.innerText;
        return text.split('\n').length;
    }

    /**
     * 生成行号HTML
     */
    function generateLineNumbers(lineCount) {
        let html = '';
        for (let i = 1; i <= lineCount; i++) {
            html += `<div class="line-number">${i}</div>`;
        }
        return html;
    }

    /**
     * 创建代码块头部
     */
    function createCodeHeader(languageInfo, lineCount, shouldShowLineNumbers) {
        const header = document.createElement('div');
        header.className = 'code-block-header';
        
        const languageDiv = document.createElement('div');
        languageDiv.className = 'code-language';
        
        const icon = document.createElement('div');
        icon.className = `language-icon ${languageInfo.key}`;
        icon.textContent = languageInfo.icon;
        
        const name = document.createElement('span');
        name.className = 'language-name';
        name.textContent = languageInfo.name;
        
        languageDiv.appendChild(icon);
        languageDiv.appendChild(name);
        
        const controls = document.createElement('div');
        controls.className = 'code-controls';
        
        // 只有超过5行才显示折叠按钮
        if (shouldShowLineNumbers) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'code-toggle-btn';
            toggleBtn.innerHTML = '<span class="toggle-icon">▼</span> 折叠';
            toggleBtn.addEventListener('click', function() {
                toggleCodeBlock(this);
            });
            controls.appendChild(toggleBtn);
        }
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '📋 复制';
        copyBtn.addEventListener('click', function() {
            copyCode(this);
        });
        controls.appendChild(copyBtn);
        
        header.appendChild(languageDiv);
        header.appendChild(controls);
        
        return header;
    }

    /**
     * 创建代码内容区域
     */
    function createCodeContent(preElement, shouldShowLineNumbers, lineCount) {
        const content = document.createElement('div');
        content.className = 'code-block-content expanded';
        
        if (shouldShowLineNumbers) {
            const linesContainer = document.createElement('div');
            linesContainer.className = 'code-lines';
            
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            lineNumbers.innerHTML = generateLineNumbers(lineCount);
            
            const codeContent = document.createElement('div');
            codeContent.className = 'code-content';
            codeContent.appendChild(preElement.cloneNode(true));
            
            linesContainer.appendChild(lineNumbers);
            linesContainer.appendChild(codeContent);
            content.appendChild(linesContainer);
        } else {
            const codeContent = document.createElement('div');
            codeContent.className = 'code-content no-line-numbers';
            codeContent.appendChild(preElement.cloneNode(true));
            content.appendChild(codeContent);
        }
        
        return content;
    }

    /**
     * 切换代码块折叠状态
     */
    function toggleCodeBlock(button) {
        const wrapper = button.closest('.code-block-wrapper');
        const content = wrapper.querySelector('.code-block-content');
        const icon = button.querySelector('.toggle-icon');
        
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            icon.textContent = '▼';
            button.innerHTML = '<span class="toggle-icon">▼</span> 折叠';
        } else {
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            icon.textContent = '▶';
            button.innerHTML = '<span class="toggle-icon">▶</span> 展开';
        }
    }

    /**
     * 复制代码到剪贴板
     */
    function copyCode(button) {
        const wrapper = button.closest('.code-block-wrapper');
        const codeElement = wrapper.querySelector('pre code') || wrapper.querySelector('code');
        const text = codeElement.textContent || codeElement.innerText;
        
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        try {
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            
            // 显示复制成功提示
            showCopySuccess(wrapper);
        } catch (err) {
            console.error('复制失败:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * 显示复制成功提示
     */
    function showCopySuccess(wrapper) {
        // 移除已存在的提示
        const existingTip = wrapper.querySelector('.copy-success');
        if (existingTip) {
            existingTip.remove();
        }
        
        const tip = document.createElement('div');
        tip.className = 'copy-success';
        tip.textContent = '复制成功!';
        wrapper.appendChild(tip);
        
        // 显示动画
        setTimeout(() => {
            tip.classList.add('show');
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            tip.classList.remove('show');
            setTimeout(() => {
                if (tip.parentNode) {
                    tip.parentNode.removeChild(tip);
                }
            }, 300);
        }, 2000);
    }

    /**
     * 处理代码块
     */
    function processCodeBlock(preElement) {
        const codeElement = preElement.querySelector('code');
        if (!codeElement) return;
        
        // 获取语言信息
        const languageInfo = getLanguageInfo(codeElement.className);
        
        // 计算行数
        const lineCount = countLines(codeElement);
        
        // 判断是否显示行号（超过5行）
        const shouldShowLineNumbers = lineCount > 5;
        
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // 创建头部
        const header = createCodeHeader(languageInfo, lineCount, shouldShowLineNumbers);
        
        // 创建内容
        const content = createCodeContent(preElement, shouldShowLineNumbers, lineCount);
        
        // 组装
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        
        // 替换原始元素
        preElement.parentNode.replaceChild(wrapper, preElement);
    }

    /**
     * 初始化所有代码块
     */
    function initCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(function(codeElement) {
            const preElement = codeElement.parentNode;
            if (preElement.tagName === 'PRE' && !preElement.closest('.code-block-wrapper')) {
                processCodeBlock(preElement);
            }
        });
    }

    /**
     * 页面加载完成后初始化
     */
    function init() {
        // DOM加载完成后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCodeBlocks);
        } else {
            initCodeBlocks();
        }
        
        // 监听动态内容变化（适用于SPA或AJAX加载的内容）
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const codeBlocks = node.querySelectorAll ? node.querySelectorAll('pre code') : [];
                            codeBlocks.forEach(function(codeElement) {
                                const preElement = codeElement.parentNode;
                                if (preElement.tagName === 'PRE' && !preElement.closest('.code-block-wrapper')) {
                                    processCodeBlock(preElement);
                                }
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动初始化
    init();

})();
