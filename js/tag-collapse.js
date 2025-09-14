(function() {
    'use strict';

    function initCollapse() {
        // 初始化Bootstrap折叠功能
        $('.tag-posts-grouped .panel-heading a').each(function() {
            const $this = $(this);
            const targetId = $this.attr('href');
            const $collapseElement = $(targetId);
            
            if ($collapseElement.length) {
                // 默认展开第一个分类，其他分类折叠
                if ($this.closest('.panel').index() === 0) {
                    $collapseElement.collapse('show');
                    $this.attr('aria-expanded', 'true');
                } else {
                    $collapseElement.collapse('hide');
                    $this.attr('aria-expanded', 'false');
                }
            }
        });

        // 监听折叠事件
        $('.tag-posts-grouped .panel-collapse').on('show.bs.collapse', function() {
            const $this = $(this);
            const $trigger = $('[href="#' + $this.attr('id') + '"]');
            $trigger.attr('aria-expanded', 'true');
        });

        $('.tag-posts-grouped .panel-collapse').on('hide.bs.collapse', function() {
            const $this = $(this);
            const $trigger = $('[href="#' + $this.attr('id') + '"]');
            $trigger.attr('aria-expanded', 'false');
        });
    }

    function init() {
        // 确保DOM准备就绪
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCollapse);
        } else {
            initCollapse();
        }
    }

    init();
})();
