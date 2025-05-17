import random

# Load poll_ids from seed_polls.sql
def load_poll_ids(polls_file):
    ids = []
    with open(polls_file, 'r') as f:
        for line in f:
            if line.startswith("INSERT INTO polls"):
                poll_id = line.split("VALUES")[1].split(",")[0].strip(" ('")
                ids.append(poll_id)
    return ids

# Overwrite poll_managers.sql with poll_id added
def add_poll_ids_to_poll_managers_inplace(managers_file, poll_ids):
    random.shuffle(poll_ids)

    with open(managers_file, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    for i, line in enumerate(lines):
        if line.startswith("INSERT INTO poll_managers"):
            parts = line.strip().split("VALUES")[1].strip(" ();").split(",")
            manager_id = parts[0].strip(" '")
            user_id = parts[1].strip(" '")
            poll_id = poll_ids[i % len(poll_ids)]

            updated_line = (
                f"INSERT INTO poll_managers (id, poll_id, user_id) "
                f"VALUES ('{manager_id}', '{poll_id}', '{user_id}');\n"
            )
            updated_lines.append(updated_line)
        else:
            updated_lines.append(line)

    with open(managers_file, 'w') as f:
        f.writelines(updated_lines)

# Run it
poll_ids = load_poll_ids("seed_polls.sql")
add_poll_ids_to_poll_managers_inplace(
    managers_file="seed_poll_managers.sql",
    poll_ids=poll_ids
)
