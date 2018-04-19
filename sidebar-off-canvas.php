<div class="wrapper invert off-canvas-right" id="off-canvas-right">
    <a class="close-canvas" data-toggle="#off-canvas-right" data-toggle-class="open">
        <i class="l-close"></i>
        <?php _e( "Close", LAYERS_THEME_SLUG ); ?>
    </a>

    <div class="content nav-mobile clearfix">
        <?php wp_nav_menu( array( 'theme_location' => LAYERS_THEME_SLUG . '-primary' ,'container' => 'nav', 'container_class' => 'nav nav-vertical', 'fallback_cb' => 'layers_blank_menu' ) ); ?>
    </div>
    <?php dynamic_sidebar( LAYERS_THEME_SLUG . '-off-canvas-sidebar' ); ?>
</div>