'use client';

import { motion } from 'framer-motion';

export default function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
