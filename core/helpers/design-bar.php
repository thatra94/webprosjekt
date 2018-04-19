<?php /**
 * Widget Design Controller Class
 *
 * This file is the source of the Widget Design Pop out  in Layers.
 *
 * @package Layers
 * @since Layers 1.0.0
 */

class Layers_Design_Controller {

	/**
	* Generate Design Options
	*
	* @param   string   $type                Sidebar type, side/top
	* @param   array    $args                Args for name, id, etc
	* @param   array    $instance            Widget $instance
	* @param   array    $components          Array of standard components to support
	* @param   array    $custom_components   Array of custom components and elements
	*/

	public function __construct( $type = 'side' , $args = NULL, $instance = array(), $components = array( 'columns' , 'background' , 'imagealign' ) , $custom_components = array() ) {

		// Initiate Widget Inputs
		$this->form_elements = new Layers_Form_Elements();

		// If there is no args information provided, can the operation
		if( NULL == $args ) return;

		// Store args (merged with defaults)
		$defaults = array(
			'container_class' => '', // Optional unique css classes
			'align' => 'left', // left | right
			'inline' => FALSE, // Inline will make the buttons appear interface-y - as one individual button after the next.
		);
		$this->args = wp_parse_args( $args, $defaults );

		// Store type (side | top)
		$this->type = $type;

		// Store widget instance
		$this->instance = $instance;

		// Store widget values
		if( empty( $instance ) ) {
			$this->values = array( 'design' => NULL );
		} elseif( isset( $instance[ 'design' ] ) ) {
			$this->values = $instance[ 'design' ];
		} else {
			$this->values = NULL;
		}

		// Store components & custom_components
		$this->components = $components;
		$this->custom_components = $custom_components;

		// Setup the controls
		$this->setup_controls();

		// Fire off the design bar
		$this->render_design_bar();
	}

	public function render_design_bar() {

		$container_class = array();
		$container_class[] = 'layers-design-bar';
		$container_class[] = ( 'side' == $this->type ? 'layers-design-bar-right' : 'layers-design-bar-horizontal' );
		$container_class[] = ( 'side' == $this->type ? 'layers-pull-right' : 'layers-visuals-horizontal' );
		$container_class[] = 'layers-visuals';

		// Apply custom container classes passed by args.
		$container_class[] = $this->args['container_class'];

		// Apply `left`, `right`, align to the container class.
		switch ( $this->args['align'] ) {
			case 'left':
				// This is the default state so no unique class-name needed.
				break;
			case 'right':
				$container_class[] = 'layers-align-right';
				break;
		}

		// Apply `inline`.
		if ( TRUE === $this->args['inline'] ){
			$container_class[] = 'layers-visuals-inline';
		}
		?>
		<div class="<?php echo esc_attr( implode( ' ', $container_class ) ); ?>">
			<div class="layers-visuals-title">
				<span class="icon-settings layers-small"></span>
			</div>
			<ul class="layers-design-bar-nav layers-visuals-wrapper layers-clearfix">
				<?php // Render Design Controls
				$this->render_controls(); ?>
				<?php // Show trash icon (for use when in an accordian)
				$this->render_trash_control(); ?>
				<?php if( 'side' == $this->type && !class_exists( 'Layers_Pro' ) ) { ?>
					<li class="layers-visuals-item layers-pro-upsell">
						<a href="https://www.layerswp.com/layers-pro/?ref=obox&utm_source=layers%20theme&utm_medium=link&utm_campaign=Layers%20Pro%20Upsell&utm_content=Widget%20Design%20Bar" target="_blank">
							<?php _e( 'Upgrade to Layers Pro', 'layerswp' ); ?>
						</a>
					</li>
				<?php } ?>
			</ul>
		</div>
	<?php }

	private function setup_controls() {

		$this->controls = array();

		foreach( (array) $this->components as $component_key => $component_value ) {

			if ( is_array( $component_value ) ) {

				// This case allows for overriding of existing Design Bar Component types, and the creating of new custom Components.
				$method = "{$component_key}_component";

				if ( method_exists( $this, $method ) ) {

					// This is the overriding existing component case.
					ob_start();
					$this->$method( $component_value );
					$this->controls[] = trim( ob_get_clean() );
				}
				else {

					// This is the creating of new custom component case.
					ob_start();
					$this->custom_component(
						$component_key, // Give the component a key (will be used as class name too)
						$component_value // Send through the inputs that will be used
					);
					$this->controls[] = trim( ob_get_clean() );
				}
			}
			elseif ( 'custom' === $component_value && !empty( $this->custom_components ) ) {

				// This case is legacy - the old method of creating custom components.
				foreach ( $this->custom_components as $key => $custom_component_args ) {

					ob_start();
					$this->custom_component(
						$key, // Give the component a key (will be used as class name too)
						$custom_component_args // Send through the inputs that will be used
					);
					$this->controls[] = trim( ob_get_clean() );
				}
			}
			elseif ( method_exists( $this, "{$component_value}_component" ) ) {

				// This is the standard method of calling a component that already exists
				$method = "{$component_value}_component";

				ob_start();
				$this->$method();
				$this->controls[] = trim( ob_get_clean() );
			}
		}

	}

	private function render_controls(){

		// If there are no controls to render, do nothing
		if( empty( $this->controls ) ) return;

		echo implode( '', $this->controls );
	}

	/**
	* Custom Compontent
	*
	* @param    string     $key        Simply the key and classname for the icon,
	* @param    array       $args       Component arguments, including the form items
	*/

	public function render_control( $key = NULL, $args = array() ){

		if( empty( $args ) ) return;

		// Setup variables from $args
		$icon_css = $args[ 'icon-css' ];
		$label = $args[ 'label' ];
		$menu_wrapper_class = ( isset( $args[ 'wrapper-class' ] ) ? $args[ 'wrapper-class' ] : 'layers-pop-menu-wrapper layers-content-small' );

		// Add a fallback to the elements arguments
		$element_args = ( isset( $args[ 'elements' ] ) ? $args[ 'elements' ] : array() );

		// Return filtered element array
		$elements = apply_filters( 'layers_design_bar_' . $key . '_elements', $element_args );


		if( isset( $this->args[ 'widget_id' ] ) ){
			
			// echo '<pre>' . 'layers_design_bar_' . $key . '_' . $this->args[ 'widget_id' ] . '_elements' . '</pre>';

			if( isset( $this->args[ 'widget_id' ] ) ){

				$elements = apply_filters(
					'layers_design_bar_' . $key . '_' . $this->args[ 'widget_id' ] . '_elements',
					$elements,
					$this
				);
				
			}
		} ?>

		<li class="layers-design-bar-nav-item layers-visuals-item" data-filter="<?php echo 'layers_design_bar_' . $key . '_' . $this->args[ 'widget_id' ] . '_elements'; ?>">
			<a href="" class="layers-icon-wrapper">
				<span class="<?php echo esc_attr( $icon_css ); ?>"></span>
				<span class="layers-icon-description">
					<?php echo $label; ?>
				</span>
			</a>
			<?php if( isset( $elements ) ) { ?>
				<div class="<?php echo esc_attr( $menu_wrapper_class ); ?>">
					<div class="layers-pop-menu-setting">
						<?php foreach( $elements as $key => $form_args ) { ?>
						   <?php echo $this->render_input( $form_args ); ?>
						<?php } ?>
					</div>
				</div>
			<?php } // if we have elements ?>
		</li>
	<?php }

	private function render_trash_control(){

		if( isset( $this->args['show_trash'] ) && TRUE === $this->args['show_trash'] ) { ?>
		<li class="layers-visuals-item layers-pull-right">
			<a href="" class="layers-icon-wrapper layers-icon-error">
				<span class="icon-trash" data-number="<?php echo $this->args['number']; ?>"></span>
			</a>
		</li>
	<?php }
	}

	/**
	 * Load input HTML
	 *
	 * @param    array       $array()    Existing option array if exists (optional)
	 * @return   array       $array      Array of options, all standard DOM input options
	 */
	public function render_input( $form_args = array() ) {

		// Set defaults.
		$defaults = array(
			'wrapper' => NULL,
			'wrapper-class' => '',
		);
		
		// Apply defaults.
		$form_args = wp_parse_args( $form_args, $defaults );
	
		$data_show_if = array();
		if ( isset( $form_args['data']['show-if-selector'] ) ){
			$data_show_if['show-if-selector'] = 'data-show-if-selector="' . esc_attr( $form_args['data']['show-if-selector'] ) . '"';
			unset( $form_args['data']['show-if-selector'] );
		}
		if ( isset( $form_args['data']['show-if-value'] ) ) {
			$data_show_if['show-if-value'] = 'data-show-if-value="' . esc_attr( $form_args['data']['show-if-value'] ) . '"';
			unset( $form_args['data']['show-if-value'] );
		}
		if ( isset( $form_args['data']['show-if-operator'] ) ) {
			$data_show_if['show-if-operator'] = 'data-show-if-operator="' . esc_attr( $form_args['data']['show-if-operator'] ) . '"';
			unset( $form_args['data']['show-if-operator'] );
		}

		// If `wrapper-class` is specified then make sure `wrapper` is set so we have a parent to put the wrapper class.
		if ( ! isset( $form_args['wrapper'] ) && isset( $form_args['wrapper-class'] ) ) {
			$form_args['wrapper'] = 'div';
		}

		// Prep Class
		$class = array();
		$class[] = 'layers-form-item';
		$class[] = 'layers-' . $form_args['type'] . '-wrapper';
		$class[] = 'layers-design-bar-form-item';
		if ( isset( $form_args['class'] ) ) {
			// Grab the class if specified.
			$class = array_merge( $class, explode( ' ', $form_args['class'] ) );
			unset( $form_args['class'] );
		}
		
		// If input_class then set it to 'class' arg that the form->input expects.
		if ( isset( $form_args['input_class'] ) ) {
			$form_args['class'] = $form_args['input_class'];
		}

		if ( 'group-start' == $form_args['type'] ) {

			// Group Start.
			?>
			<div class="layers-design-bar-group">

				<div class="<?php echo esc_attr( implode( ' ', $class ) ); ?>" <?php echo implode( ' ', $data_show_if ); ?>>
					<label><?php echo esc_html( $form_args['label'] ); ?></label>
					<?php echo $this->form_elements->input( $form_args ); ?>
				</div>

				<div class="layers-design-bar-group-inner">
			<?php
		}
		elseif ( 'group-end' == $form_args['type'] ) {

			// Group End.
			?>
				</div>
			</div>
			<?php
		}

		elseif ( 'tab-start' == $form_args['type'] ) {

			// Tab Start.
			?>
			<div class="layers-design-bar-tab" id="<?php echo esc_attr( $form_args['id'] ); ?>">
			<?php
		}
		elseif ( 'tab-end' == $form_args['type'] ) {

			// Tab End.
			?>
			</div>
			<?php
		}

		else {

			// Everything else.
			
			/*
			 * Convert 'class' setting to 'wrapper-class' for Select-Icons - allows us to use the same syntax for the Customizer Controls and the Widgets.
			 * e.g. `'class' => 'layers-icon-group-inline layers-icon-group-inline-outline icon-group-inline-flexible layers-span-12',`
			 */
			if ( in_array( 'layers-icon-group-inline', $class ) ) {
				$form_args['wrapper'] = 'div';
				$form_args['wrapper-class'] .= ' layers-icon-group';
				if ( ( $key = array_search( 'layers-icon-group-inline', $class ) ) !== false ) { unset( $class[$key] ); } // Unset once used.
			}
			if ( in_array( 'layers-icon-group-inline-outline', $class ) ) {
				$form_args['wrapper-class'] .= ' layers-icon-group-inline-outline';
				if ( ( $key = array_search( 'layers-icon-group-inline-outline', $class ) ) !== false ) { unset( $class[$key] ); } // Unset once used.
			}
			if ( in_array( 'layers-icon-group-inline-flexible', $class ) ) {
				$form_args['wrapper-class'] .= ' layers-icon-group-inline-flexible';
				if ( ( $key = array_search( 'layers-icon-group-inline-flexible', $class ) ) !== false ) { unset( $class[$key] ); } // Unset once used.
			}
			?>
			<div class="<?php echo esc_attr( implode( ' ', $class ) ); ?>" <?php echo implode( ' ', $data_show_if ); ?>>

				<?php if (
					'checkbox' != $form_args['type'] &&
					'switch' != $form_args['type'] &&
					isset( $form_args['label'] ) &&
					'' != $form_args['label']
					) { ?>
					<label><?php echo esc_html( $form_args['label'] ); ?></label>
				<?php } ?>

				<?php if ( isset( $form_args['wrapper'] ) ) { ?>
					<<?php echo $form_args['wrapper']; ?> <?php if ( isset( $form_args['wrapper-class'] ) ) echo 'class="' . $form_args['wrapper-class'] . '"'; ?>>
				<?php } ?>

				<?php if ( isset( $form_args['group'] ) && is_array( $form_args['group'] ) ) {
					foreach( $form_args[ 'group' ] as $input_key => $input_args ){
						echo $this->form_elements->input( $input_args );
					}
				} else {
					echo $this->form_elements->input( $form_args );
				}?>

				<?php if ( isset( $form_args['wrapper'] ) ) { ?>
					</<?php echo $form_args['wrapper']; ?>>
				<?php } ?>

				<?php if ( isset( $form_args['description'] ) ) { ?>
					<div class="layers-form-item-description"><?php echo $form_args['description']; ?></div>
				<?php } ?>

			</div>
			<?php
		}
	}

	/**
	 * Layout Options
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function layout_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'layout';

		// Setup icon CSS
		$defaults['icon-css'] = ( isset( $this->values['layout'] ) && NULL != $this->values ? 'icon-' . $this->values['layout'] : 'icon-layout-fullwidth' );

		// Add a Label
		$defaults['label'] = __( 'Layout', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate ';

		// Add elements
		$defaults['elements']['layout-start'] = array(
			'label' => __( 'Layout' , 'layerswp' ),
			'type' => 'group-start'
		);

			$defaults['elements']['layout'] = array(
				'type' => 'select-icons',
				'name' => $this->get_layers_field_name( 'layout' ),
				'id' => $this->get_layers_field_id( 'layout' ),
				'value' => ( isset( $this->values['layout'] ) ) ? $this->values['layout'] : NULL,
				'options' => array(
					'layout-boxed' => __( 'Boxed', 'layerswp' ),
					'layout-fullwidth' => __( 'Full Width', 'layerswp' ),
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
			);


			$defaults['elements']['padding'] = array(
				'type' => 'inline-numbers-fields',
				'label' => __( 'Padding (px)', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'advanced', 'padding' ),
				'id' => $this->get_layers_field_id( 'advanced', 'padding' ),
				'value' => ( isset( $this->values['advanced']['padding'] ) ) ? $this->values['advanced']['padding'] : NULL,
				'input_class' => 'inline-fields-flush',
			);

			$defaults['elements']['margin'] = array(
				'type' => 'inline-numbers-fields',
				'label' => __( 'Margin (px)', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'advanced', 'margin' ),
				'id' => $this->get_layers_field_id( 'advanced', 'margin' ),
				'value' => ( isset( $this->values['advanced']['margin'] ) ) ? $this->values['advanced']['margin'] : NULL,
				'input_class' => 'inline-fields-flush',
			);


		$defaults['elements']['layout-end'] = array(
			'type' => 'group-end'
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_layout_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * List Style - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function liststyle_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'liststyle';

		// Setup icon CSS
		$defaults['icon-css'] = ( isset( $this->values['liststyle'] ) && NULL != $this->values ? 'icon-' . $this->values['liststyle'] : 'icon-list-masonry' );

		// Add a Label
		$defaults['label'] = __( 'List Style', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-small';

		// Add elements
		$defaults['elements']['liststyle'] = array(
			'type' => 'select-icons',
			'name' => $this->get_layers_field_name( 'liststyle' ),
			'id' => $this->get_layers_field_id( 'liststyle' ),
			'value' => ( isset( $this->values['liststyle'] ) ) ? $this->values['liststyle'] : NULL,
			'options' => array(
				'list-grid' => __( 'Grid', 'layerswp' ),
				'list-list' => __( 'List', 'layerswp' ),
				'list-masonry' => __( 'Masonry', 'layerswp' )
			)
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_liststyle_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Columns - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function columns_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'columns';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-columns';

		// Add a Label
		$defaults['label'] = __( 'Columns', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-content-small';

		// Add elements
		
		$defaults['elements']['column-layout-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Columns', 'layerswp' ),
		);

			$defaults['elements']['columns'] = array(
				'type' => 'select',
				'name' => $this->get_layers_field_name( 'columns' ),
				'id' => $this->get_layers_field_id( 'columns' ),
				'value' => ( isset( $this->values['columns'] ) ) ? $this->values['columns'] : NULL,
				'options' => array(
					'1' => __( '1 Column', 'layerswp' ),
					'2' => __( '2 Columns', 'layerswp' ),
					'3' => __( '3 Columns', 'layerswp' ),
					'4' => __( '4 Columns', 'layerswp' ),
					'6' => __( '6 Columns', 'layerswp' ),
				)
			);

			$defaults['elements']['gutter'] = array(
				'type' => 'checkbox',
				'label' => __( 'Gutter', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'gutter' ),
				'id' => $this->get_layers_field_id( 'gutter' ),
				'value' => ( isset( $this->values['gutter'] ) ) ? $this->values['gutter'] : NULL
			);

			// Only show this for the Post widget (Post Carousel widget doesn't use this option, meanwhile 3rd party authors would already have liststyle separate )
			if( 'post' == $this->args[ 'widget_id' ] ) {

				$defaults['elements']['liststyle'] = array(
					'type' => 'select-icons',
					'label' => __( 'List Style' , 'layerswp' ),
					'name' => $this->get_layers_field_name( 'liststyle' ),
					'id' => $this->get_layers_field_id( 'liststyle' ),
					'value' => ( isset( $this->values['liststyle'] ) ) ? $this->values['liststyle'] : NULL,
					'options' => array(
						'list-grid' => __( 'Grid', 'layerswp' ),
						'list-list' => __( 'List', 'layerswp' ),
						'list-masonry' => __( 'Masonry', 'layerswp' )
					),
					'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
				);

			}

		$defaults['elements']['column-layout-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['column-text-align-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Text Style', 'layerswp' ),
		);
		
			$defaults['elements']['column-text-color'] = array(
				'type' => 'color',
				'label' => __( 'Text Color', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'column-text-color' ),
				'id' => $this->get_layers_field_id( 'columns-text-color' ),
				'value' => ( isset( $this->values['column-text-color'] ) ) ? $this->values['column-text-color'] : NULL
			);

			$defaults['elements']['column-textalign'] = array(
				'type' => 'select-icons',
				'label' => __( 'Text Alignment', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'column-text-align' ),
				'id' => $this->get_layers_field_id( 'column-text-align' ),
				'value' => ( isset( $this->values['column-text-align'] ) ) ? $this->values['column-text-align'] : NULL,
				'options' => array(
					'text-left' => __( 'Left', 'layerswp' ),
					'text-center' => __( 'Center', 'layerswp' ),
					'text-right' => __( 'Right', 'layerswp' ),
					'text-justify' => __( 'Justify', 'layerswp' )
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
			);

		$defaults['elements']['column-text-align-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['column-background-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Background Color', 'layerswp' ),
		);

			$defaults['elements']['column-background-color'] = array(
				'type' => 'color',
				'label' => __( 'Background Color', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'column-background-color' ),
				'id' => $this->get_layers_field_id( 'columns-background-color' ),
				'value' => ( isset( $this->values['column-background-color'] ) ) ? $this->values['column-background-color'] : NULL
			);

		$defaults['elements']['column-background-end'] = array(
			'type' => 'group-end',
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_columns_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Text Align - Static Option
	 *https://soundcloud.com/deardeerrecords/dear-deer-radioshow-050-robert-babicz
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function textalign_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'textalign';

		// Setup icon CSS
		$defaults['icon-css'] = ( isset( $this->values['textalign'] ) && NULL != $this->values ? 'icon-' . $this->values['textalign'] : 'icon-text-center' );

		// Add a Label
		$defaults['label'] = __( 'Text Align', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-content-small';

		// Add elements
		$defaults['elements']['textalign'] = array(
			'type' => 'select-icons',
			'name' => $this->get_layers_field_name( 'textalign' ),
			'id' => $this->get_layers_field_id( 'textalign' ),
			'value' => ( isset( $this->values['textalign'] ) ) ? $this->values['textalign'] : NULL,
			'options' => array(
				'text-left' => __( 'Left', 'layerswp' ),
				'text-center' => __( 'Center', 'layerswp' ),
				'text-right' => __( 'Right', 'layerswp' ),
				'text-justify' => __( 'Justify', 'layerswp' )
			)
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_textalign_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Image Align - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function imagealign_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'imagealign';

		// Setup icon CSS
		$defaults['icon-css'] = ( isset( $this->values['imagealign'] ) && NULL != $this->values ? 'icon-' . $this->values['imagealign'] : 'icon-image-left' );

		// Add a Label
		$defaults['label'] = __( 'Image Align', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-small';

		// Add elements
		$defaults['elements']['imagealign'] = array(
			'type' => 'select-icons',
			'name' => $this->get_layers_field_name( 'imagealign' ),
			'id' => $this->get_layers_field_id( 'imagealign' ),
			'value' => ( isset( $this->values['imagealign'] ) ) ? $this->values['imagealign'] : NULL,
			'options' => array(
				'image-left' => __( 'Left', 'layerswp' ),
				'image-right' => __( 'Right', 'layerswp' ),
				'image-top' => __( 'Top', 'layerswp' ),
			)
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_imagealign_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Featured Image - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function featuredimage_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'featuredimage';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-featured-image';

		// Add a Label
		$defaults['label'] = __( 'Featured Media', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-content-small';

		// Add elements
		$defaults['elements']['featuredimage-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Featured Image', 'layerswp' ),
		);

			$defaults['elements']['featuredimage'] = array(
				'type' => 'image',
				'name' => $this->get_layers_field_name( 'featuredimage' ),
				'id' => $this->get_layers_field_id( 'featuredimage' ),
				'value' => ( isset( $this->values['featuredimage'] ) ) ? $this->values['featuredimage'] : NULL
			);

			$defaults['elements']['imageratios'] = array(
				'type' => 'select-icons',
				'label' => __( 'Image Ratio', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'imageratios' ),
				'id' => $this->get_layers_field_id( 'imageratios' ),
				'value' => ( isset( $this->values['imageratios'] ) ) ? $this->values['imageratios'] : NULL,
				'options' => array(
					'image-portrait' => __( 'Portrait', 'layerswp' ),
					'image-landscape' => __( 'Landscape', 'layerswp' ),
					'image-square' => __( 'Square', 'layerswp' ),
					'image-no-crop' => __( 'None', 'layerswp' ),
					'image-round' => __( 'Round', 'layerswp' ),
				),
				'data' => array(
					'show-if-selector' => '#' . $this->get_layers_field_id( 'featuredimage' ),
					'show-if-value' => '',
					'show-if-operator' => '!==',
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline'
			);

		$defaults['elements']['featuredimage-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['featuredvideo-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Featured Video', 'layerswp' ),
		);
			
			$defaults['elements']['featuredvideo'] = array(
				'type' => 'text',
				'description' => __( '<strong>TIP:</strong> Paste links from YouTube, Vimeo, DailyMotion, Twitter or Flickr.', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'featuredvideo' ),
				'id' => $this->get_layers_field_id( 'featuredvideo' ),
				'value' => ( isset( $this->values['featuredvideo'] ) ) ? $this->values['featuredvideo'] : NULL
			);

		$defaults['elements']['featuredvideo-end'] = array(
			'type' => 'group-end',
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_featuredimage_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Image Size - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function imageratios_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'imageratios';

		// Setup icon CSS
		$defaults['icon-css'] = ( isset( $this->values['imageratios'] ) && NULL != $this->values ? 'icon-' . $this->values['imageratios'] : 'icon-image-size' );

		// Add a Label
		$defaults['label'] = __( 'Image Ratio', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-small';

		// Add elements
		$defaults['elements']['imageratio'] = array(
			'type' => 'select-icons',
			'name' => $this->get_layers_field_name( 'imageratios' ),
			'id' => $this->get_layers_field_id( 'imageratios' ),
			'value' => ( isset( $this->values['imageratios'] ) ) ? $this->values['imageratios'] : NULL,
			'options' => array(
				'image-portrait' => __( 'Portrait', 'layerswp' ),
				'image-landscape' => __( 'Landscape', 'layerswp' ),
				'image-square' => __( 'Square', 'layerswp' ),
				'image-no-crop' => __( 'None', 'layerswp' ),
				'image-round' => __( 'Round', 'layerswp' )
			)
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_imageratios_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}
	/**
	 * Fonts - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function fonts_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'fonts';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-font-size';

		// Add a Label
		$defaults['label'] = __( 'Text', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-content-small';

		// Add elements
		$defaults['elements'] = array(
			'fonts-align' => array(
				'type' => 'select-icons',
				'label' => __( 'Text Align', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'fonts', 'align' ),
				'id' => $this->get_layers_field_id( 'fonts', 'align' ),
				'value' => ( isset( $this->values['fonts']['align'] ) ) ? $this->values['fonts']['align'] : NULL,
				'options' => array(
					'text-left' => __( 'Left', 'layerswp' ),
					'text-center' => __( 'Center', 'layerswp' ),
					'text-right' => __( 'Right', 'layerswp' ),
					'text-justify' => __( 'Justify', 'layerswp' )
				),
				'wrapper' => 'div',
				'wrapper-class' => 'layers-icon-group layers-icon-group-outline'
			),
			'fonts-size' => array(
				'type' => 'select',
				'label' => __( 'Text Size', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'fonts', 'size' ),
				'id' => $this->get_layers_field_id( 'fonts', 'size' ),
				'value' => ( isset( $this->values['fonts']['size'] ) ) ? $this->values['fonts']['size'] : NULL,
				'options' => array(
					'small' => __( 'Small', 'layerswp' ),
					'medium' => __( 'Medium', 'layerswp' ),
					'large' => __( 'Large', 'layerswp' )
				)
			),
			'fonts-color' => array(
				'type' => 'color',
				'label' => __( 'Text Color', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'fonts', 'color' ),
				'id' => $this->get_layers_field_id( 'fonts', 'color' ),
				'value' => ( isset( $this->values['fonts']['color'] ) ) ? $this->values['fonts']['color'] : NULL
			)
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layerswp_font_component_args', $args, $key, $this->type, $this->args, $this->values ) );
	}


	/**
	 * Fonts - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function header_excerpt_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'header_excerpt';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-font-size';

		// Add a Label
		$defaults['label'] = __( 'Text', 'layerswp' );

		// Add a Wrapper Class
		$defaults['wrapper-class'] = 'layers-pop-menu-wrapper layers-animate layers-content-small';

		// Add elements
		$defaults['elements']['fonts-size-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Text Size', 'layerswp' ),
		);

			$defaults['elements']['fonts-size'] = array(
				'type' => 'select',
				'name' => $this->get_layers_field_name( 'fonts', 'size' ),
				'id' => $this->get_layers_field_id( 'fonts', 'size' ),
				'value' => ( isset( $this->values['fonts']['size'] ) ) ? $this->values['fonts']['size'] : NULL,
				'options' => array(
					'small' => __( 'Small', 'layerswp' ),
					'medium' => __( 'Medium', 'layerswp' ),
					'large' => __( 'Large', 'layerswp' )
				)
			);

		$defaults['elements']['fonts-size-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['fonts-align-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Text Alignment', 'layerswp' ),
		);

			$defaults['elements']['fonts-align'] = array(
				'type' => 'select-icons',
				'name' => $this->get_layers_field_name( 'fonts', 'align' ),
				'id' => $this->get_layers_field_id( 'fonts', 'align' ),
				'value' => ( isset( $this->values['fonts']['align'] ) ) ? $this->values['fonts']['align'] : NULL,
				'options' => array(
					'text-left' => __( 'Left', 'layerswp' ),
					'text-center' => __( 'Center', 'layerswp' ),
					'text-right' => __( 'Right', 'layerswp' ),
					'text-justify' => __( 'Justify', 'layerswp' )
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
			);

		$defaults['elements']['fonts-align-end'] = array(
			'type' => 'group-end',
		);

		if( $this->args[ 'widget_id' ] != 'layers-pro-tabs' && $this->args[ 'widget_id' ] != 'layers-pro-accordions' ){
				$defaults['elements']['fonts-header-style-start'] = array(
					'type' => 'group-start',
					'label' => __( 'Header Styling', 'layerswp' ),
				);

					$defaults['elements']['fonts-color'] = array(
						'type' => 'color',
						'label' => __( 'Text Color', 'layerswp' ),
						'name' => $this->get_layers_field_name( 'fonts', 'color' ),
						'id' => $this->get_layers_field_id( 'fonts', 'color' ),
						'value' => ( isset( $this->values['fonts']['color'] ) ) ? $this->values['fonts']['color'] : NULL
					);

					if( !class_exists( 'Layers_Pro' ) ) {
						$defaults['elements']['fonts-header-upsell'] = array(
							'type' => 'html',
							'html' => '<div class="layers-upsell-tag">
								<span class="layers-upsell-title">Upgrade to Layers Pro</span>
									<div class="description customize-control-description">
									Use unique Google Fonts, bold, italicize or fine-tune your fonts with <a target="_blank" href="https://www.layerswp.com/layers-pro/?ref=obox&amp;utm_source=layers%20theme&amp;utm_medium=link&amp;utm_campaign=Layers%20Pro%20Upsell&amp;utm_content=Widget%Font%20Styling">Layers Pro</a>!
									</div>
								</div>'
							);
					}

				$defaults['elements']['fonts-header-style-end'] = array(
					'type' => 'group-end',
				);

		}

	
		$defaults['elements']['fonts-excerpt-style-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Excerpt Styling', 'layerswp' ),
		);

			$defaults['elements']['fonts-excerpt-color'] = array(
				'type' => 'color',
				'label' => __( 'Text Color', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'fonts', 'excerpt-color' ),
				'id' => $this->get_layers_field_id( 'fonts', 'excerpt', 'color' ),
				'value' => ( isset( $this->values['fonts']['excerpt-color'] ) ) ? $this->values['fonts']['excerpt-color'] : NULL
			);

			if( !class_exists( 'Layers_Pro' ) ) {
				$defaults['elements']['fonts-upsell'] = array(
					'type' => 'html',
					'html' => '<div class="layers-upsell-tag">
						<span class="layers-upsell-title">Upgrade to Layers Pro</span>
							<div class="description customize-control-description">
								Use unique Google Fonts, capitalize, strike through or fine-tune your excerpt with <a target="_blank" href="https://www.layerswp.com/layers-pro/?ref=obox&amp;utm_source=layers%20theme&amp;utm_medium=link&amp;utm_campaign=Layers%20Pro%20Upsell&amp;utm_content=Widget%Font%20Styling">Layers Pro</a>!
							</div>
						</div>'
					);
			}

		$defaults['elements']['fonts-excerpt-style-end'] = array(
			'type' => 'group-end',
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_header_excerpt_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Background - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function background_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'background';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-photo';

		// Add a Label
		$defaults['label'] = __( 'Background', 'layerswp' );

		$defaults['elements']['background-color-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Background Color', 'layerswp' ),
		);

			// Add elements
			$defaults['elements']['background-color'] = array(
				'type' => 'color',
				'label' => __( 'Background Color', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'color' ),
				'id' => $this->get_layers_field_id( 'background', 'color' ),
				'value' => ( isset( $this->values['background']['color'] ) ) ? $this->values['background']['color'] : NULL
			);

		$defaults['elements']['background-color-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['background-image-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Background Image', 'layerswp' ),
		);

			$defaults['elements']['background-image'] = array(
				'type' => 'image',
				'button_label' => __( 'Choose Image', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'image' ),
				'id' => $this->get_layers_field_id( 'background', 'image' ),
				'value' => ( isset( $this->values['background']['image'] ) ) ? $this->values['background']['image'] : NULL,
			);
			$defaults['elements']['background-repeat'] = array(
				'type' => 'select-icons',
				'label' => __( 'Background Repeat', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'repeat' ),
				'id' => $this->get_layers_field_id( 'background', 'repeat' ),
				'value' => ( isset( $this->values['background']['repeat'] ) ) ? $this->values['background']['repeat'] : NULL,
				'options' => array(
					'no-repeat' => array( 'name' => __( 'No Repeat', 'layerswp' ), 'class' => 'icon-background-no-repeat' ),
					'repeat' => array( 'name' => __( 'Repeat', 'layerswp' ), 'class' => 'icon-background-repeat' ),
					'repeat-x' => array( 'name' => __( 'Repeat Horizontal', 'layerswp' ), 'class' => 'icon-background-repeat-horizontal' ),
					'repeat-y' => array( 'name' => __( 'Repeat Vertical', 'layerswp' ), 'class' => 'icon-background-repeat-vertical' ),
				),
				'data' => array(
					'show-if-selector' => '#' . $this->get_layers_field_id( 'background', 'image' ),
					'show-if-value' => '',
					'show-if-operator' => '!=='
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
			);

			$defaults['elements']['background-position'] = array(
				'type' => 'select-icons',
				'label' => __( 'Background Position', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'position' ),
				'id' => $this->get_layers_field_id( 'background', 'position' ),
				'value' => ( isset( $this->values['background']['position'] ) ) ? $this->values['background']['position'] : NULL,
				'options' => array(
					'center' => array( 'name' => __( 'Center', 'layerswp' ), 'class' => 'icon-background-position-center' ),
					'top' => array( 'name' => __( 'Top', 'layerswp' ), 'class' => 'icon-background-position-top' ),
					'bottom' => array( 'name' => __( 'Bottom', 'layerswp' ), 'class' => 'icon-background-position-bottom' ),
					'left' => array( 'name' => __( 'Left', 'layerswp' ), 'class' => 'icon-background-position-left' ),
					'right' => array( 'name' => __( 'Right', 'layerswp' ), 'class' => 'icon-background-position-right' ),
				),
				'data' => array(
					'show-if-selector' => '#' . $this->get_layers_field_id( 'background', 'image' ),
					'show-if-value' => '',
					'show-if-operator' => '!=='
				),
				'class' => 'layers-icon-group-inline layers-icon-group-inline-outline',
			);

			$defaults['elements']['background-stretch'] = array(
				'type' => 'checkbox',
				'label' => __( 'Stretch', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'stretch' ),
				'id' => $this->get_layers_field_id( 'background', 'stretch' ),
				'value' => ( isset( $this->values['background']['stretch'] ) ) ? $this->values['background']['stretch'] : NULL,
				'data' => array(
					'show-if-selector' => '#' . $this->get_layers_field_id( 'background', 'image' ),
					'show-if-value' => '',
					'show-if-operator' => '!=='
				),
			);
			

			if( !class_exists( 'Layers_Pro' ) ) {
				$defaults['elements']['background-parallax'] = array(
					'type' => 'checkbox',
					'label' => __( 'Parallax <span class="layers-inline-upsell">Available in <a href="https://www.layerswp.com/layers-pro/?ref=obox&amp;utm_source=layers%20theme&amp;utm_medium=link&amp;utm_campaign=Layers%20Pro%20Upsell&amp;utm_content=Widget%20Parallax%20Upsell" target="_blank">Pro</a></span>', 'layerswp' ),
					'name' => $this->get_layers_field_name( 'background', 'parallax' ),
					'id' => $this->get_layers_field_id( 'background', 'parallax' ),
					'data' => array(
						'show-if-selector' => '#' . $this->get_layers_field_id( 'background', 'image' ),
						'show-if-value' => '',
						'show-if-operator' => '!=='
					),
					'disabled' => true
				);
			}
					
			$defaults['elements']['background-darken'] = array(
				'type' => 'checkbox',
				'label' => __( 'Darken', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'background', 'darken' ),
				'id' => $this->get_layers_field_id( 'background', 'darken' ),
				'value' => ( isset( $this->values['background']['darken'] ) ) ? $this->values['background']['darken'] : NULL,
			);

		$defaults['elements']['background-image-end'] = array(
			'type' => 'group-end',
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_background_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Call To Action Customization - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function buttons_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'buttons';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-call-to-action';

		// Add a Label
		$defaults['label'] = __( 'Buttons', 'layerswp' );

		// Add elements
		
		$defaults['elements']['buttons-size'] = array(
			'type' => 'select',
			'label' => __( 'Size', 'layerswp' ),
			'name' => $this->get_layers_field_name( 'buttons', 'buttons-size' ),
			'id' => $this->get_layers_field_id( 'buttons', 'buttons-size' ),
			'value' => ( isset( $this->values['buttons']['buttons-size'] ) ) ? $this->values['buttons']['buttons-size'] : NULL,
			'options' => array(
				'small' => __( 'Small', 'layerswp' ),
				'medium' => __( 'Medium', 'layerswp' ),
				'large' => __( 'Large', 'layerswp' )
			)
		);

		// Only this one used to be here.
		$defaults['elements']['buttons-background-color'] = array(
			'type' => 'color',
			'label' => __( 'Background Color', 'layerswp' ),
			'name' => $this->get_layers_field_name( 'buttons', 'background-color' ),
			'id' => $this->get_layers_field_id( 'buttons', 'background-color' ),
			'value' => ( isset( $this->values['buttons']['background-color'] ) ) ? $this->values['buttons']['background-color'] : NULL
		);

		if( !class_exists( 'Layers_Pro' ) ) {
			$defaults['elements']['buttons-upsell'] = array(
				'type' => 'html',
				'html' => '<div class="layers-upsell-tag">
							<span class="layers-upsell-title">Upgrade to Layers Pro</span>
							<div class="description customize-control-description">
								Want more control over your button styling and sizes? <a target="_blank" href="https://www.layerswp.com/layers-pro/?ref=obox&amp;utm_source=layers%20theme&amp;utm_medium=link&amp;utm_campaign=Layers%20Pro%20Upsell&amp;utm_content=Widget%20Button%20Control">Purchase Layers Pro</a> to unlock the full power of Layers!
							</div>
						</div>'
			);
		}

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_button_colors_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}
	/**
	 * Advanced - Static Option
	 *
	 * @param    array       $args       Additional arguments to pass to this function
	 */
	public function advanced_component( $args = array() ) {

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Set a key for this input
		$key = 'advanced';

		// Setup icon CSS
		$defaults['icon-css'] = 'icon-settings';

		// Add a Label
		$defaults['label'] = __( 'Advanced', 'layerswp' );

		// Add elements
		
		$defaults['elements']['advanced-anchor-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Anchor &amp; Widget ID', 'layerswp' ),
		);

			$defaults['elements']['anchor'] = array(
				'type' => 'text',
				'label' => __( 'Custom Anchor', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'advanced', 'anchor' ) ,
				'id' => $this->get_layers_field_id( 'advanced', 'anchor' ) ,
				'value' => ( isset( $this->values['advanced']['anchor'] ) ) ? $this->values['advanced']['anchor'] : NULL
			);

			$defaults['elements']['widget-id'] = array(
				'type' => 'text',
				'label' => __( 'Widget ID', 'layerswp' ),
				'disabled' => FALSE,
				'value' => '#'  . str_replace( 'widget-layers', 'layers', str_ireplace( '-design' , '', $this->args['id'] ) )
			);

		$defaults['elements']['advanced-anchor-end'] = array(
			'type' => 'group-end',
		);

		$defaults['elements']['advanced-css-start'] = array(
			'type' => 'group-start',
			'label' => __( 'Custom Classes', 'layerswp' ),
		);

			$defaults['elements']['customclass'] = array(
				'type' => 'text',
				'name' => $this->get_layers_field_name( 'advanced', 'customclass' ),
				'id' => $this->get_layers_field_id( 'advanced', 'customclass' ),
				'value' => ( isset( $this->values['advanced']['customclass'] ) ) ? $this->values['advanced']['customclass'] : NULL,
				'placeholder' => 'example-class'
			);

			$defaults['elements']['customcss'] = array(
				'type' => 'textarea',
				'label' => __( 'Custom CSS', 'layerswp' ),
				'name' => $this->get_layers_field_name( 'advanced', 'customcss' ),
				'id' => $this->get_layers_field_id( 'advanced', 'customcss' ),
				'value' => ( isset( $this->values['advanced']['customcss'] ) ) ? $this->values['advanced']['customcss'] : NULL,
				'placeholder' => ".classname { color: #333; }"
			);

		$defaults['elements']['advanced-css-end'] = array(
			'type' => 'group-end',
		);

		$args = $this->merge_component( $defaults, $args );

		$this->render_control( $key, apply_filters( 'layers_advanced_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Custom Compontent
	 *
	 * @param    string     $key        Simply the key and classname for the icon,
	 * @param    array       $args       Component arguments, including the form items
	 */
	public function custom_component( $key = NULL, $args = array() ) {

		if ( empty( $args ) )
			return;

		// If there is no args information provided, can the operation
		if ( NULL == $this->args )
			return;

		// Render Control
		$this->render_control( $key, apply_filters( 'layers_custom_component_args', $args, $key, $this->type, $this->args, $this->values, $this ) );
	}

	/**
	 * Merge Compontent
	 */
	public function merge_component( $defaults, $args ) {

		// Grab the elements and unset them - so we can work with them individually.
		$defaults_elements = isset( $defaults['elements'] ) ? $defaults['elements'] : array() ;
		if ( isset( $defaults['elements'] ) ) unset( $defaults['elements'] );

		$args_elements = isset( $args['elements'] ) ? $args['elements'] : array() ;
		if ( isset( $args['elements'] ) ) unset( $args['elements'] );

		// New collection of elements consisting of a specific combo of the $defaults and the $args.
		$new_elements = array();

		foreach ( $args_elements as $args_key => $args_value ) {

			if ( is_string( $args_value ) && isset( $defaults_elements[ $args_value ] ) ) {

				// This case means the caller has specified a custom $args 'elements' config
				// but has only passed a ref to the input by it's 'string 'background-image'
				// allowing them to reposition the input without redefining all the settings
				// the input.
				$new_elements[ $args_value ] = $defaults_elements[ $args_value ];

				// We've got what we needed from this element so remove it from the reference array.
				if ( isset( $defaults_elements[ $args_key ] ) ) {
					unset( $defaults_elements[ $args_value ] );
				}
			}
			else if( isset( $defaults_elements[ $args_key ] ) && is_array( $defaults_elements[ $args_key ] ) && is_array( $args_elements[ $args_key ] ) ) {

				// This case means the caller intends to combine the defaults with new
				// parameters, keeping the existing fields but adding new things to it
				$new_elements[ $args_key ] =  $args_elements[ $args_key ] + $defaults_elements[ $args_key ];
			}
			else if ( is_array( $args_value ) ) {

				// This case means the caller has specified a custom $args 'elements' config
				// and has specified their own custom input field config - allowing them to
				// create a new custom field.
				$new_elements[ $args_key ] = $args_value;

				// We've got what we needed from this element so remove it from the reference array.
				if ( isset( $defaults_elements[ $args_key ] ) ) {
					unset( $defaults_elements[ $args_key ] );
				}
			}
		}

		// This handles merging the important non-elements like 'icon-css' and 'title'
		$args = array_merge( $defaults, $args );

		// Either 'replace' or 'merge' the new input - so either show only the ones you have chosen
		// or show the ones you have chosen after the defaults of the component.
		if ( isset( $args['elements_combine'] ) && 'replace' === $args['elements_combine'] ) {
			$args['elements'] = $new_elements;
		}
		else{ // 'merge' or anything else.
			$args['elements'] = array_merge( $defaults_elements, $new_elements );
		}

		return $args;
	}

	/**
	 * Widget name generation (replaces get_custom_field_id)
	 *
	 * @param    string  $field_name_1   Level 1 name
	 * @param    string  $field_name_2   Level 2 name
 	 * @param    string  $field_name_3   Level 3 name
 	 * @return   string  Name attribute
	 */
	function get_layers_field_name( $field_name_1 = '', $field_name_2 = '', $field_name_3 = '' ) {

		// If we don't have these important args details then bail.
		if ( ! isset( $this->args['name'] ) ) return;

		// Compile the first part.
		$string = $this->args['name'];

		// Now add any custom strings passed as args.
		if( '' != $field_name_1 ) $string .= '[' . $field_name_1 . ']';
		if( '' != $field_name_2 ) $string .= '[' . $field_name_2 . ']';
		if( '' != $field_name_3 ) $string .= '[' . $field_name_3 . ']';

		if ( ( bool ) layers_get_theme_mod( 'dev-switch-widget-field-names' ) ) {
			$debug_string = substr( $string, ( strpos( $string, ']' ) + 1 ), strlen( $string ) );
			echo '<span class="layers-widget-defaults-debug">' . $debug_string . '</span><br />';
		}

		return $string;
	}

	/**
	 * Widget id generation (replaces get_custom_field_id)
	 *
	 * @param    string  $field_name_1   Level 1 id
	 * @param    string  $field_name_2   Level 2 id
 	 * @param    string  $field_name_3   Level 3 id
 	 * @return   string  Id attribute
	 */
	function get_layers_field_id( $field_name_1 = '', $field_name_2 = '', $field_id = '' ) {

		// If we don't have these important args details then bail.
		if ( ! isset( $this->args['id'] ) ) return;

		// Compile the first part.
		$string = $this->args['id'];

		// Now add any custom strings passed as args.
		if( '' != $field_name_1 ) $string .= '-' . $field_name_1;
		if( '' != $field_name_2 ) $string .= '-' . $field_name_2;
		if( '' != $field_id ) $string .= '-' . $field_id;

		return $string;
	}

} //class Layers_Design_Controller
