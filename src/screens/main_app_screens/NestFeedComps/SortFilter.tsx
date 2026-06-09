

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SortDropdown from './SortDropdown';
import FilterDropdown from './FilterDropdown';

const SortFilter = ({scrollSignal}: {scrollSignal:number}) => {

    const [sortHide, setSortHide] = useState(false);
    const [filterHide, setFilterHide] = useState(false);
    return (
        <View className="flex-row items-center justify-start mt-3">
            <SortDropdown sortHide={sortHide} setFilterHide={setFilterHide} scrollSignal={scrollSignal} />
            <FilterDropdown filterHide={filterHide} setSortHide={setSortHide} scrollSignal={scrollSignal} />
        </View>
    );
}

const styles = StyleSheet.create({})

export default SortFilter;
