<?php ob_start();

do_action('woocommerce_before_shop_loop');

$before_shop_loop = ob_get_contents();

ob_end_clean(); ?>

<?php if( '' != $before_shop_loop ) : ?>
	<div class="woocommerce-result-count-container push-bottom clearfix">
		<?php echo $before_shop_loop; ?>
	</div>
<?php endif; ?>