import type { Workflow } from "./model";

export function renderInstallScript(workflow: Workflow) {
  return `
  gray='\\033[0;37m'
  yellow='\\033[1;33m'
  green='\\033[0;32m'
  reset='\\033[0m'

  function print_table {
  echo

  # Calculate the maximum width for each column
  local -a max_widths
  for ((i=0; i<\${#header[@]}; i++)); do
    max_widths[i]=\${#header[i]}
  done

  for row in "\${table[@]}"; do
    IFS='|' read -r -a columns <<< "$row"
    for ((i=0; i<\${#columns[@]}; i++)); do
      if (( \${#columns[i]} > max_widths[i] )); then
        max_widths[i]=\${#columns[i]}
      fi
    done
  done

  # Print the header with padding
  printf "  | "
  for ((i=0; i<\${#header[@]}; i++)); do
    printf "%-\${max_widths[i]}s | " "\${header[i]}"
  done
  printf "\n"

  # Print the header separator
  printf "  |"
  for ((i=0; i<\${#header[@]}; i++)); do
    printf "%s|" "$(printf '%*s' $((max_widths[i]+2)) | tr ' ' '-')"
  done
  printf "\n"

  # Print the rows with padding
  for row in "\${table[@]}"; do
    IFS='|' read -r -a columns <<< "$row"
    printf "  | "
    for ((i=0; i<\${#columns[@]}; i++)); do
      if (( i == 0 )); then
        printf "\${yellow}%-\${max_widths[i]}s\${reset} | " "\${columns[i]}"
      else
        printf "%-\${max_widths[i]}s | " "\${columns[i]}"
      fi
    done
    printf "\n"
  done

  echo
}

mkdir -p $(pwd)/.github/workflows

if [ -f "$(pwd)/.github/workflows/${workflow.name}.yaml" ]; then
  printf "\n\${gray}Workflow already exists. Overwrite? (y/n) \${reset}\n"

  read answer </dev/tty

  if [[ $answer != "y" ]]; then
    exit 0
  fi
fi

workflowPath=$(pwd)/.github/workflows/${workflow.name}.yaml

cat << 'EOF' > $workflowPath
${workflow.contents}
EOF

printf "\n\${green}✅ Workflow created successfully!\${reset}\n"

printf "\n\${gray}You can find the workflow file under \${workflowPath}\n"

${
  Object.keys(workflow.secrets) &&
  `

printf "\n\${gray}This workflow requires you to create the following secrets within your GitHub repository:\n"
# Define the table
header=("Repository Secret" "Description")
table=(${Object.keys(workflow.secrets).map(
    (name) => `"${name}|${workflow.secrets[name].description}"`,
  )})

print_table
`
}
`;
}
