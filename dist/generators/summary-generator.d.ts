import { type AnalysisResult, type SummaryRenderOptions } from '../types';
export declare class SummaryGenerator {
    generateDocument(results: readonly AnalysisResult[], options: SummaryRenderOptions): string;
    private renderGroupedSections;
    private renderResult;
    private renderTechnicalDetails;
    private renderLinks;
    private complexityBadge;
    private significanceIcon;
    private significanceMarker;
    private toAnchor;
    private normalizePath;
    private capitalize;
}
