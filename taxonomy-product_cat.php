<?php
/**
 * The template for displaying Woo Commerce products
 *
 * @package Layers
 * @since Layers 1.0.0
 * @version     3.3.0
 */

get_header(); ?>

<?php get_template_part( 'partials/header' , 'page-title' ); ?>

<div class="<?php if( 'layout-fullwidth' != layers_get_theme_mod( 'content-layout-layout' ) ) echo 'container'; ?> clearfix content-main">
	<div class="grid">
		<?php /**
		* Maybe show the left sidebar
		*/
		layers_maybe_get_sidebar( 'left-woocommerce-sidebar', implode( ' ', layers_get_wrapper_class( 'left_woocommerce_sidebar', 'column pull-left sidebar span-3' ) ) ); ?>

		<?php if ( have_posts()) : ?>
			<div <?php layers_center_column_class(); ?>>
				
				<?php get_template_part( 'partials/woocommerce', 'before-shop-loop' ); ?>

				<?php // Sub category listing
				if( function_exists( 'woocommerce_product_loop_start' ) ) woocommerce_product_loop_start(); ?>

				<ul class="products grid">

					<?php while (have_posts()) :  the_post(); ?>
							<?php wc_get_template_part( 'content' , 'product' ); ?>
					<?php endwhile; ?>
				</ul>

				<?php layers_pagination(); ?>

				<?php woocommerce_product_loop_end(); ?>

			</div>
		<?php endif; ?>

		<?php /**
		* Maybe show the right sidebar
		*/
		layers_maybe_get_sidebar( 'right-woocommerce-sidebar', implode( ' ', layers_get_wrapper_class( 'right_woocommerce_sidebar', 'column pull-right sidebar span-3 no-gutter' ) ) ); ?>
	</div><!-- /row -->
</div>

<?php get_footer();