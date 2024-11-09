import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppView } from '../AppView';

const Notch = (props: any) => <AppView style={styles.root} {...props} />;

export default memo(Notch);

const styles = StyleSheet.create({
	root: {
		width: 8,
		height: 8,
		borderLeftColor: 'rgba(0, 0, 0, 0)',
		borderRightColor: 'rgba(0, 0, 0, 0)',
		// borderTopColor: "#FE6600",
		borderTopColor: '#4598ee',
		borderLeftWidth: 4,
		borderRightWidth: 4,
		borderTopWidth: 8,
	},
});
