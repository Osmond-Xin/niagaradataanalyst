/**
 * 工程实践与原则页面
 * 展示在近期动手项目中实践的务实工程原则
 */
import type { Metadata } from 'next';
import ArchitectureContent from './ArchitectureContent';

export const metadata: Metadata = {
  title: 'Engineering Practice & Principles | 工程实践与原则',
  description: 'Pragmatic engineering principles — technology selection, testing discipline, operations, and retrospectives — practiced in recent hands-on projects like job-hunt and Matrix-Sync.',
  keywords: ['engineering principles', 'testing discipline', 'LangGraph', 'IIoT', 'job-hunt', 'Matrix-Sync', 'Python', 'Go'],
};

export default function ArchitecturePage() {
  return <ArchitectureContent />;
}
