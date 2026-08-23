def define_env(env):
    """Define macros and filters for MkDocs Macros plugin."""

    @env.macro
    def recipe_matrix(steps):
        """Render a cooking-for-engineers-style step/ingredient flow table.

        Args:
            steps: list of dicts with 'label' (str) and 'inputs' (list of str)
        """
        # Collect all unique inputs in order of first appearance
        seen = set()
        all_inputs = []
        for step in steps:
            for inp in step.get("inputs", []):
                if inp not in seen:
                    seen.add(inp)
                    all_inputs.append(inp)

        html = '<div class="recipe-matrix">\n'
        html += '<table class="recipe-matrix-table">\n'

        # Header: rotated step labels
        html += '<thead><tr>'
        html += '<th class="recipe-matrix-corner"></th>'
        for step in steps:
            label = step.get("label", "")
            html += f'<th class="recipe-matrix-step-header"><div class="recipe-matrix-step-label">{label}</div></th>'
        html += '</tr></thead>\n'

        # Body: one row per ingredient
        html += '<tbody>\n'
        for inp in all_inputs:
            html += '<tr>'
            html += f'<td class="recipe-matrix-ingredient">{inp}</td>'
            for step in steps:
                if inp in step.get("inputs", []):
                    html += '<td class="recipe-matrix-cell recipe-matrix-cell--active"></td>'
                else:
                    html += '<td class="recipe-matrix-cell"></td>'
            html += '</tr>\n'
        html += '</tbody>\n'

        html += '</table>\n</div>\n'
        return html
