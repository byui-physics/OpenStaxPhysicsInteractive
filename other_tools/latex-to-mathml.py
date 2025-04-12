from latex2mathml import converter

''' INPUT PARAMETERS '''
latex_eq = r"\nabla \times \mathbf E = \frac{\partial \mathbf B}{\partial t}."
inline = False # change this depending on what you want


''' Conversion Code '''
# Convert LaTeX to MathML
mathml = converter.convert(latex_eq)

# Wrap the MathML in the required <span> and <math> tags
inline_string = ' display="inline"' if inline else ''
formatted_mathml = f'<span class="os-math-in-para"><math xmlns="http://www.w3.org/1998/Math/MathML"{inline_string}>{mathml}</math></span>'

# Print the MathML in the desired format
print()
print(formatted_mathml)
print()

