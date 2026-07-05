import React from 'react';
import { Text } from 'react-native';

const SectionTitle = ({ title }: { title: string }) => (
    <Text className="text-[#7ac7ea] text-sm font-oswald-semiBold uppercase tracking-widest mb-2 mt-4">
        {title}
    </Text>
);

export default SectionTitle;