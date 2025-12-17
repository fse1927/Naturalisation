'use client';

import { motion } from 'framer-motion';

export default function ScaleIn({
    children,
    className,
    delay = 0
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
